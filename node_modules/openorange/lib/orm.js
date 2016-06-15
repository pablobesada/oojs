"use strict";
var db = require("./db")
var async = require("async")
var Promise = require("bluebird")
var ormutils = require("./ormutils.js")
var Query = require("./serverquery.js")

Promise.config({
    longStackTraces: true
})
var orm = {}

function raw_insert_row_function(connection, record) {
    var insert = orm.generate_insert_sql(record);
    //console.log(insert.sql)
    return connection.query(insert.sql, insert.values)
        .then(function (info) {
            record.internalId = info.insertId;
            record.syncVersion = 1;
            record.setNewFlag(false);
            record.setModifiedFlag(false);
        })
}

function raw_delete_row_function(connection, record) {
    var del = orm.generate_delete_sql(record);
    //console.log(del.sql)
    //console.log(del.values)
    return connection.query(del.sql, del.values)
        .then(function (info) {
            if (info.affectedRows != 1) {
                throw {code: "ROW_NOT_DELETED", message: "Row couldn't be deleted"}
                return;
            }
        })
}

function raw_update_row_function(connection, record) {
    var update = orm.generate_update_sql(record);
    //console.log(update.sql)
    return connection.query(update.sql, update.values)
        .then(function (info) {
            if (info.changedRows != 1) {
                throw {code: "ROW_NOT_UPDATED", message: "Row couldn't be updated"}
            } else {
                record.setNewFlag(false);
                record.setModifiedFlag(false);
            }
        })
}

function deleteDetailFunction(connection, record, detailname) {
    var detail = record.details(detailname);
    var del = orm.generate_delete_detail_sql(record, detailname);
    //console.log(del.sql)
    //console.log(del.values)
    return connection.query(del.sql, del.values)
}

function saveDetailFunction(connection, record, detailname) {
    var funcs = [];
    return new Promise(function (resolve, reject) {
        var detail = record.details(detailname);
        for (var i = 0; i < detail.length; i++) {
            var row = detail[i];
            row.masterId = record.internalId;
            row.rowNr = i;
            if (row.isModified()) {
                if (row.isNew()) {
                    funcs.push(raw_insert_row_function(connection, row))
                } else {
                    funcs.push(raw_update_row_function(connection, row))
                }
            }
        }
        for (var i = 0; i < detail.__removed_rows__.length; i++) {
            var row = detail.__removed_rows__[i];
            if (!row.isNew()) {
                funcs.push(raw_delete_row_function(connection, row))
            }
        }
        resolve();
    })
        .then(function () {
            return Promise.all(funcs)
        })
}

orm.generate_insert_sql = function generate_insert_sql(record) {
    var fieldnames = record.fieldNames();
    var questions = [];
    var values = [];
    var fnames = []

    for (var i = 0; i < fieldnames.length; i++) {
        var fn = fieldnames[i];
        if (fn == 'internalId') continue;
        fnames.push("`" + fn + "`");
        questions.push("?");
        if (fn == 'syncVersion') {
            values.push(1);
        } else {
            values.push(record.fields(fn).getSQLValue());
        }
    }
    var sql = "INSERT INTO " + record.__description__.name + " (" + fnames.join(",") + ") VALUES (" + questions.join(",") + ")";
    return {sql: sql, values: values};
}

orm.generate_update_sql = function generate_update_sql(record) {
    var fieldnames = record.fieldNames();
    var values = [];
    var setfields = [];
    var where = [];
    for (var i = 0; i < fieldnames.length; i++) {
        var fn = fieldnames[i];
        setfields.push("`" + fn + "`=?");
        if (fn == 'syncVersion') {
            values.push(record[fn] + 1);
        } else {
            values.push(record.fields(fn).getSQLValue());
        }
    }
    where.push("`internalId`=?");
    values.push(record.oldFields("internalId").getSQLValue());
    if (record.hasField("syncVersion")) {
        where.push("`syncVersion`=?");
        values.push(record.oldFields("syncVersion").getSQLValue());
    }
    var sql = "UPDATE " + record.__description__.name + " SET " + setfields.join(",") + " WHERE " + where.join(" AND ");
    return {sql: sql, values: values};
}

orm.generate_delete_sql = function generate_update_sql(record) {
    var values = [];
    var where = [];
    where.push("`internalId`=?");
    values.push(record.internalId);
    if (record.hasField("syncVersion")) {
        where.push("`syncVersion`=?");
        values.push(record.syncVersion);
    }
    var sql = "DELETE FROM " + record.__description__.name + " WHERE " + where.join(" AND ");
    return {sql: sql, values: values};
}

orm.generate_delete_detail_sql = function generate_update_sql(record, detailname) {
    var values = [];
    var where = [];
    where.push("`masterId`=?");
    values.push(record.internalId);
    var sql = "DELETE FROM " + record.details(detailname).__description__.class + " WHERE " + where.join(" AND ");
    return {sql: sql, values: values};
}

function select_detail_function2(conn, record, dn) {
    return function (cb) {
        var select = orm.generate_select_detail_sql(record, dn);
        //console.log(select.sql)
        var detail = record.details(dn);
        conn.query(select.sql, select.values, function (err, rows, fields) {
            if (err) {
                cb(err);
                return;
            }
            rows.forEach(function (row) {
                var rw = detail.newRow();
                ormutils.fill_record_with_query_result(rw, row, fields);
                detail.push(rw);
                rw.setNewFlag(false);
                rw.setModifiedFlag(false);
            })
            cb(null);
            return;
        })
    }
}

function select_detail_function(conn, record, dn) {
    var select = orm.generate_select_detail_sql(record, dn);
    //console.log(select.sql)
    var detail = record.details(dn);
    return conn.query(select.sql, select.values)
        .spread(function (rows, fields) {
            rows.forEach(function (row) {
                var rw = detail.newRow();
                ormutils.fill_record_with_query_result(rw, row, fields);
                detail.push(rw);
                rw.setNewFlag(false);
                rw.setModifiedFlag(false);
            })
        })
}

orm.load2 = function load(record, callback) {
    var conn = null;
    async.series([
            function (cb) {
                db.pool.getConnection(function (err, val) {
                    conn = val;
                    if (err && conn) conn.release();
                    cb(err);
                });
            },
            function (cb) {
                var select = orm.generate_load_sql(record);
                //console.log(select.sql)
                conn.query(select.sql, select.values, function (err, rows, fields) {
                    if (err) {
                        cb(err);
                        return;
                    }
                    if (rows == 0) {
                        cb({error: "record not found"})
                        return;
                    }
                    ormutils.fill_record_with_query_result(record, rows[0], fields)
                    record.setNewFlag(false);
                    record.setModifiedFlag(false);
                    cb(null);
                    return;
                })
            },
            function (cb) {
                var funcs = [];
                record.detailNames().forEach(function (dn) {
                    funcs.push(select_detail_function(conn, record, dn))
                })
                async.parallel(funcs,
                    function result(err, results) {
                        cb(err);
                    }
                )
            }],
        function result(err, results) {
            if (conn) conn.release();
            callback(err);
        }
    );
}

orm.load = function load(record) {
    var conn = null;
    return db.getConnection()
        .then(function (newconn) {
            conn = newconn;
            var select = orm.generate_load_sql(record);
            //console.log(select.sql)
            return conn.query(select.sql, select.values)
        })
        .spread(function (rows, fields) {
            if (rows == 0) {
                throw {error: "record not found"}
            }
            ormutils.fill_record_with_query_result(record, rows[0], fields)
            record.setNewFlag(false);
            record.setModifiedFlag(false);
        })
        .then(function () {
            var funcs = [];
            record.detailNames().forEach(function (dn) {
                funcs.push(select_detail_function(conn, record, dn))
            })
            return Promise.all(funcs);
        }).then(function () {
            conn.release();
            conn = null;
            record.syncOldFields();
        })
        .finally(function (err) {
            if (conn != null) {
                conn.release()
                conn = null;
                //console.log(err, conn)
            }
        })
}

orm.generate_load_sql = function generate_load_sql(record) {
    var fieldnames = record.fieldNames();
    var questions = [];
    var values = [];
    var snames = []
    var where = []

    for (var i = 0; i < fieldnames.length; i++) {
        var fn = fieldnames[i];
        snames.push("`" + fn + "`");
        var value = record[fn];
        if (value != null) {
            where.push("`" + fn + "` = ?");
            values.push(record[fn]);
        }
    }
    if (where.length == 0) throw new Error("Imposible hacer select sin valores")
    var sql = "SELECT " + snames.join(",") + " FROM " + record.__description__.name + " WHERE " + where.join(" AND ") + " LIMIT 1";
    return {sql: sql, values: values};
}

orm.generate_select_detail_sql = function generate_select_detail_sql(record, detailname) {
    var detail = record.details(detailname);
    var fieldnames = detail.fieldNames();
    var questions = [];
    var values = [record.internalId];
    var snames = []
    var where = "`masterId`=?";
    var order = "rowNr ASC";

    for (var i = 0; i < fieldnames.length; i++) {
        var fn = fieldnames[i];
        snames.push("`" + fn + "`");
    }
    var sql = "SELECT " + snames.join(",") + " FROM " + detail.__description__.class + " WHERE " + where + " ORDER BY " + order;
    return {sql: sql, values: values};
}

function finish_parallel_function(conn, record, callback) {
    return function result(err, result) {
        if (err) {
            conn.rollback(function (err2) {
                conn.release();
                if (err2) {
                    callback(err2);
                    return;
                } //no estoy seguro de esto
                callback(err);
                return;
            });
        } else {
            conn.commit(function (err2) {
                conn.release();
                if (err2) {
                    callback(err2); //no estoy seguro de esto
                    return;
                }
                record.__clearRemovedRows__();
                callback(null);
                return;
            });
        }
    }
}

function finish_parallel_function(conn, record, callback) {
    return function result(err, result) {
        if (err) {
            conn.rollback(function (err2) {
                conn.release();
                if (err2) {
                    callback(err2);
                    return;
                } //no estoy seguro de esto
                callback(err);
                return;
            });
        } else {
            conn.commit(function (err2) {
                conn.release();
                if (err2) {
                    callback(err2); //no estoy seguro de esto
                    return;
                }
                record.__clearRemovedRows__();
                callback(null);
                return;
            });
        }
    }
}

function commit(conn, record) {
    return conn.commit()
        .then(function () {
            record.__clearRemovedRows__();
        })
}


function rollback(conn, record) {
    return conn.rollback();
}

function save_details_and_finish_function2(conn, record, callback) {
    return function result(err, result) {
        if (err) {
            conn.rollback(function (err2) {
                conn.release();
                if (err2) {
                    callback(err2);
                    return;
                } //no estoy seguro de esto
                callback(err);
                return;
            });
            return;
        }
        var funcs = [];
        for (var i = 0; i < record.detailNames().length; i++) {
            var f = saveDetailFunction(conn, record, record.detailNames()[i]);
            funcs.push(f);
        }
        async.parallel(funcs, finish_parallel_function(conn, record, callback));
    }
}

function save_details_and_finish_function(conn, record) {
    var funcs = [];
    return new Promise(function (resolve, reject) {
        for (var i = 0; i < record.detailNames().length; i++) {
            var f = saveDetailFunction(conn, record, record.detailNames()[i]);
            funcs.push(f);
        }
        resolve()
    })
        .then(function () {
            return Promise.all(funcs)
        })
        .then(conn.commit,
            function onReject(err) {
                //console.log("AA:" + err)
                return conn.rollback(conn)
                    .then(function () {
                        return Promise.reject(err)
                    });
            })
}

function save_new2(conn, record, callback) {
    var insert = orm.generate_insert_sql(record);
    //console.log(insert.sql)
    async.series([
            function (cb) {
                conn.beginTransaction(cb);
                return;
            },
            function (cb) {
                conn.query(insert.sql, insert.values, function (err, info) {
                    if (!err) {
                        record.internalId = info.insertId;
                        record.syncVersion = 1;
                        record.setNewFlag(false);
                        record.setModifiedFlag(false);
                    }
                    cb(err);
                    return;
                })
            }
        ], save_details_and_finish_function(conn, record, callback)
    );
}

function save_new(conn, record) {
    return conn.beginTransaction()
        .then(function () {
            var insert = orm.generate_insert_sql(record);
            //console.log(insert.sql)
            return conn.query(insert.sql, insert.values)
        })
        .then(function (info) {
            record.internalId = info.insertId;
            record.syncVersion = 1;
            record.setNewFlag(false);
            record.setModifiedFlag(false);
        })
        .then(function () {
            return save_details_and_finish_function(conn, record)
        });
}

function save_existing(conn, record, callback) {
    return conn.beginTransaction()
        .then(function () {
            var update = orm.generate_update_sql(record);
            //console.log(update.sql)
            //console.log(update.values)
            return conn.query(update.sql, update.values)
        })
        .then(function (info) {
            if (info.changedRows != 1) {
                throw {code: "WRONG_SYNCVERSION", message: "Record might have been modified by other user"}
            }
            record.syncVersion += 1;
            record.setNewFlag(false);
            record.setModifiedFlag(false);
        })
        .then(save_details_and_finish_function(conn, record))
}

function delete_details_and_finish_function(conn, record) {
    var funcs = [];
    return new Promise(function (resolve, reject) {
        for (var i = 0; i < record.detailNames().length; i++) {
            var f = deleteDetailFunction(conn, record, record.detailNames()[i]);
            funcs.push(f);
        }
        resolve();
    })
    .then(function () {
        return Promise.all(funcs)
    })
    .then(
        function () {
            return conn.commit().then(function () {
                record.syncOldFields()
            })
        },
        function onReject(err) {
            return rollback(conn, record).then(Promise.reject(err));
        }
    )
}

orm.store2 = function store(record, callback) {
    if (!record.isNew() && !record.isModified()) {
        callback(null);
        return;
    }
    db.pool.getConnection(function (err, conn) {
        if (err) {
            if (conn) conn.release();
            callback(err, null);
            return;
        }
        if (record.isNew()) {
            save_new(conn, record, callback);
        } else if (record.isModified()) {
            save_existing(conn, record, callback);
        }
    });
}

orm.store = function store(record, callback) {
    if (!record.isNew() && !record.isModified()) {
        return Promise.resolve()
    }
    var conn = null;
    return db.getConnection()
        .then(function (newconn) {
            conn = newconn;
            if (record.isNew()) {
                return save_new(conn, record);
            } else if (record.isModified()) {
                return save_existing(conn, record);
            }
        }).then(function () {
            //console.log(record.oldFields("internalId").getValue());
            record.syncOldFields();
            //console.log(record.oldFields("internalId").getValue());
        }).finally(function (err) {
            if (conn != null) {
                conn.release()
                conn = null;
                //console.log(err, conn)
            }
        });
}

orm.delete = function (record) {
    if (record.isNew()) {
        return Promise.reject({
            code: "NOT_DELETED",
            message: "Record is new. Cannot be deleted"
        });
    }
    var conn = null;
    return db.getConnection()
        .then(function (newconn) {
            conn = newconn
            return conn.beginTransaction();
        }).then(function () {
            var del = orm.generate_delete_sql(record);
            //console.log(del.sql)
            //console.log(del.values)
            return conn.query(del.sql, del.values)
        }).then(function (info) {
            //console.log(info)
            if (info.affectedRows != 1) {
                //console.log(info.affectedRows)
                throw {code: "NOT_DELETED", message: "Record might have been modified by other user."};
            }
            return delete_details_and_finish_function(conn, record);
        }).finally(function (err) {
            if (conn != null) {
                conn.release()
                conn = null;
                //console.log(err, conn)
            }
        })
}

orm.select = function select(recordClass) {
    //return Query.select(recordClass)

    var conn = null;
    return db.getConnection()
        .then(function (newconn) {
            conn = newconn;
            var select = orm.generate_select_sql(recordClass);
            return conn.query(select.sql, select.values)
        })
        .spread(function (rows, fields) {
            var result = []
            for (var i=0;i<rows.length;i++) {
                var record = recordClass.new();
                ormutils.fill_record_with_query_result(record, rows[i], fields)
                result.push(record);
            }
            return result;
        })

}

orm.generate_select_sql = function generate_select_sql(record) {
    var fieldnames = record.fieldNames();
    var questions = [];
    var values = [];
    var snames = []
    var where = []

    for (var i = 0; i < fieldnames.length; i++) {
        var fn = fieldnames[i];
        snames.push("`" + fn + "`");
        var value = record[fn];
        if (value != null) {
            //where.push("`" + fn + "` = ?");
            values.push(record[fn]);
        }
    }
    var sql = "SELECT " + snames.join(",") + " FROM " + record.__description__.name; // + " WHERE " + where.join(" AND ") + " LIMIT 1";
    return {sql: sql, values: values};
}

module.exports = orm