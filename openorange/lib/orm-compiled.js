"use strict";

var db = require("./db");
var async = require("async");

var orm = {};

function raw_insert_row_function(connection, record) {
    return function (callback) {
        var insert = orm.generate_insert_sql(record);
        console.log(insert.sql);
        connection.query(insert.sql, insert.values, function (err, info) {
            if (!err) {
                record.internalId = info.insertId;
                record.syncVersion = 1;
                record.setNewFlag(false);
                record.setModifiedFlag(false);
            }
            callback(err);
            return;
        });
    };
}

function raw_delete_row_function(connection, record) {
    return function (callback) {
        var del = orm.generate_delete_sql(record);
        console.log(del.sql);
        console.log(del.values);
        connection.query(del.sql, del.values, function (err, info) {
            if (!err) {
                console.log(info);
                if (info.affectedRows != 1) {
                    callback({ code: "ROW_NOT_DELETED", message: "Row couldn't be deleted" });
                    return;
                }
            }
            callback(err);
            return;
        });
    };
}

function raw_update_row_function(connection, record) {
    return function (callback) {
        var update = orm.generate_update_sql(record);
        console.log(update.sql);
        connection.query(update.sql, update.values, function (err, info) {
            if (!err) {
                if (info.changedRows != 1) {
                    callback({ code: "ROW_NOT_UPDATED", message: "Row couldn't be updated" });
                    return;
                } else {
                    record.setNewFlag(false);
                    record.setModifiedFlag(false);
                }
            }
            callback(err);
            return;
        });
    };
}

function deleteDetailFunction(connection, record, detailname) {
    var detail = record.details(detailname);
    return function (callback) {
        var del = orm.generate_delete_detail_sql(record, detailname);
        console.log(del.sql);
        console.log(del.values);
        connection.query(del.sql, del.values, function (err, info) {
            callback(err);
            return;
        });
    };
}

function saveDetailFunction(connection, record, detailname) {
    var detail = record.details(detailname);
    return function (callback) {
        var funcs = [];
        for (var i = 0; i < detail.length; i++) {
            var row = detail[i];
            row.masterId = record.internalId;
            row.rowNr = i;
            if (row.isModified()) {
                if (row.isNew()) {
                    funcs.push(raw_insert_row_function(connection, row));
                } else {
                    funcs.push(raw_update_row_function(connection, row));
                }
            }
        }
        for (var i = 0; i < detail.__removed_rows__.length; i++) {
            var row = detail.__removed_rows__[i];
            if (!row.isNew()) {
                funcs.push(raw_delete_row_function(connection, row));
            }
        }
        console.log(detailname, detail);
        async.series(funcs, function result(err, result) {
            callback(err);
        });
    };
}

orm.generate_insert_sql = function generate_insert_sql(record) {
    var fieldnames = record.fieldNames();
    var questions = [];
    var values = [];
    var fnames = [];

    for (var i = 0; i < fieldnames.length; i++) {
        var fn = fieldnames[i];
        if (fn == 'internalId') continue;
        fnames.push("`" + fn + "`");
        questions.push("?");
        if (fn == 'syncVersion') {
            values.push(1);
        } else {
            values.push(record[fn]);
        }
    }
    var sql = "INSERT INTO " + record.__description__.name + " (" + fnames.join(",") + ") VALUES (" + questions.join(",") + ")";
    return { sql: sql, values: values };
};

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
            values.push(record[fn]);
        }
    }
    where.push("`internalId`=?");
    values.push(record.internalId);
    if (record.hasField("syncVersion")) {
        where.push("`syncVersion`=?");
        values.push(record.syncVersion);
    }
    var sql = "UPDATE " + record.__description__.name + " SET " + setfields.join(",") + " WHERE " + where.join(" AND ");
    return { sql: sql, values: values };
};

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
    return { sql: sql, values: values };
};

orm.generate_delete_detail_sql = function generate_update_sql(record, detailname) {
    var values = [];
    var where = [];
    where.push("`masterId`=?");
    values.push(record.internalId);
    var sql = "DELETE FROM " + record.details(detailname).__description__.class + " WHERE " + where.join(" AND ");
    return { sql: sql, values: values };
};

function fill_record_with_query_result(record, row, fields) {
    for (var i = 0; i < fields.length; i++) {
        var fn = fields[i].name;
        record[fn] = row[fn];
    }
}

function select_detail_function(conn, record, dn) {
    return function (cb) {
        var select = orm.generate_select_detail_sql(record, dn);
        console.log(select.sql);
        var detail = record.details(dn);
        conn.query(select.sql, select.values, function (err, rows, fields) {
            if (err) {
                cb(err);
                return;
            }
            rows.forEach(function (row) {
                var rw = detail.newRow();
                fill_record_with_query_result(rw, row, fields);
                detail.push(rw);
                rw.setNewFlag(false);
                rw.setModifiedFlag(false);
            });
            cb(null);
            return;
        });
    };
}

orm.load = function load(record, callback) {
    var conn = null;
    async.series([function (cb) {
        db.pool.getConnection(function (err, val) {
            conn = val;
            if (err && conn) conn.release();
            cb(err);
        });
    }, function (cb) {
        var select = orm.generate_select_sql(record);
        conn.query(select.sql, select.values, function (err, rows, fields) {
            if (err) {
                cb(err);
                return;
            }
            if (rows == 0) {
                cb({ error: "record not found" });
                return;
            }
            fill_record_with_query_result(record, rows[0], fields);
            record.setNewFlag(false);
            record.setModifiedFlag(false);
            cb(null);
            return;
        });
    }, function (cb) {
        var funcs = [];
        record.detailNames().forEach(function (dn) {
            funcs.push(select_detail_function(conn, record, dn));
        });
        async.parallel(funcs, function result(err, results) {
            cb(err);
        });
    }], function result(err, results) {
        if (conn) conn.release();
        callback(err);
    });
};

orm.generate_select_sql = function generate_select_sql(record) {
    var fieldnames = record.fieldNames();
    var questions = [];
    var values = [];
    var snames = [];
    var where = [];

    for (var i = 0; i < fieldnames.length; i++) {
        var fn = fieldnames[i];
        snames.push("`" + fn + "`");
        var value = record[fn];
        if (value != null) {
            where.push("`" + fn + "` = ?");
            values.push(record[fn]);
        }
    }
    var sql = "SELECT " + snames.join(",") + " FROM " + record.__description__.name + " WHERE " + where.join(" AND ") + " LIMIT 1";
    return { sql: sql, values: values };
};

orm.generate_select_detail_sql = function generate_select_detail_sql(record, detailname) {
    var detail = record.details(detailname);
    var fieldnames = detail.fieldNames();
    var questions = [];
    var values = [record.internalId];
    var snames = [];
    var where = "`masterId`=?";
    var order = "rowNr ASC";

    for (var i = 0; i < fieldnames.length; i++) {
        var fn = fieldnames[i];
        snames.push("`" + fn + "`");
    }
    var sql = "SELECT " + snames.join(",") + " FROM " + detail.__description__.class + " WHERE " + where + " ORDER BY " + order;
    return { sql: sql, values: values };
};

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
    };
}

function save_details_and_finish_function(conn, record, callback) {
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
    };
}

function save_new(conn, record, callback) {
    var insert = orm.generate_insert_sql(record);
    console.log(insert.sql);
    async.series([function (cb) {
        conn.beginTransaction(cb);
        return;
    }, function (cb) {
        conn.query(insert.sql, insert.values, function (err, info) {
            if (!err) {
                record.internalId = info.insertId;
                record.syncVersion = 1;
                record.setNewFlag(false);
                record.setModifiedFlag(false);
            }
            cb(err);
            return;
        });
    }], save_details_and_finish_function(conn, record, callback));
}

function save_existing(conn, record, callback) {
    async.series([function (cb) {
        conn.beginTransaction(cb);
        return;
    }, function (cb) {
        var update = orm.generate_update_sql(record);
        console.log(update.sql);
        console.log(update.values);
        conn.query(update.sql, update.values, function (err, info) {
            if (!err) {
                if (info.changedRows != 1) {
                    cb({
                        code: "WRONG_SYNCVERSION",
                        message: "Record might have been modified by other user"
                    });
                    return;
                } else {
                    record.syncVersion += 1;
                    record.setNewFlag(false);
                    record.setModifiedFlag(false);
                }
            }
            cb(err);
            return;
        });
    }], save_details_and_finish_function(conn, record, callback));
}

function delete_details_and_finish_function(conn, record, callback) {
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
            var f = deleteDetailFunction(conn, record, record.detailNames()[i]);
            funcs.push(f);
        }
        async.parallel(funcs, finish_parallel_function(conn, record, callback));
    };
}

orm.save = function save(record, callback) {
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
};

orm.delete = function (record, callback) {
    if (record.isNew()) {
        callback({
            code: "NOT_DELETED",
            message: "Record is new. Cannot be deleted"
        });
        return;
    }
    db.pool.getConnection(function (err, conn) {
        if (err) {
            if (conn) conn.release();
            callback(err, null);
            return;
        }
        async.series([function (cb) {
            conn.beginTransaction(cb);
            return;
        }, function (cb) {
            var del = orm.generate_delete_sql(record);
            console.log(del.sql);
            console.log(del.values);
            conn.query(del.sql, del.values, function (err, info) {
                if (!err) {
                    if (info.affectedRows != 1) {
                        cb({
                            code: "NOT_DELETED",
                            message: "Record might have been modified by other user"
                        });
                        return;
                    }
                }
                cb(err);
                return;
            });
        }], delete_details_and_finish_function(conn, record, callback));
    });
};
module.exports = orm;

//# sourceMappingURL=orm-compiled.js.map