"use strict";

var save_details_and_finish_function = function () {
    var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(conn, record) {
        var funcs;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
            while (1) {
                switch (_context2.prev = _context2.next) {
                    case 0:
                        _context2.prev = 0;
                        funcs = [];
                        _context2.next = 4;
                        return new Promise(function (resolve, reject) {
                            for (var i = 0; i < record.detailNames().length; i++) {
                                var f = saveDetailFunction(conn, record, record.detailNames()[i]);
                                funcs.push(f);
                            }
                            resolve();
                        });

                    case 4:
                        _context2.next = 6;
                        return Promise.all(funcs);

                    case 6:
                        _context2.next = 8;
                        return conn.commit();

                    case 8:
                        return _context2.abrupt("return", true);

                    case 11:
                        _context2.prev = 11;
                        _context2.t0 = _context2["catch"](0);
                        _context2.next = 15;
                        return conn.rollback(conn);

                    case 15:
                        return _context2.abrupt("return", false);

                    case 16:
                    case "end":
                        return _context2.stop();
                }
            }
        }, _callee2, this, [[0, 11]]);
    }));

    return function save_details_and_finish_function(_x2, _x3) {
        return ref.apply(this, arguments);
    };
}();

var save_new = function () {
    var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee3(conn, record) {
        var insert, info;
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
            while (1) {
                switch (_context3.prev = _context3.next) {
                    case 0:
                        _context3.next = 2;
                        return conn.beginTransaction();

                    case 2:
                        insert = orm.generate_insert_sql(record);
                        _context3.next = 5;
                        return conn.query(insert.sql, insert.values);

                    case 5:
                        info = _context3.sent;

                        record.internalId = info.insertId;
                        record.syncVersion = 1;
                        record.setNewFlag(false);
                        record.setModifiedFlag(false);
                        return _context3.abrupt("return", save_details_and_finish_function(conn, record));

                    case 11:
                    case "end":
                        return _context3.stop();
                }
            }
        }, _callee3, this);
    }));

    return function save_new(_x4, _x5) {
        return ref.apply(this, arguments);
    };
}();

var save_existing = function () {
    var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee4(conn, record) {
        var update, info;
        return regeneratorRuntime.wrap(function _callee4$(_context4) {
            while (1) {
                switch (_context4.prev = _context4.next) {
                    case 0:
                        _context4.next = 2;
                        return conn.beginTransaction();

                    case 2:
                        update = orm.generate_update_sql(record);
                        _context4.next = 5;
                        return conn.query(update.sql, update.values);

                    case 5:
                        info = _context4.sent;

                        if (!(info.changedRows != 1)) {
                            _context4.next = 9;
                            break;
                        }

                        console.log({ code: "WRONG_SYNCVERSION", message: "Record might have been modified by other user " + info.changedRows });
                        return _context4.abrupt("return", false);

                    case 9:
                        record.syncVersion += 1;
                        record.setNewFlag(false);
                        record.setModifiedFlag(false);
                        return _context4.abrupt("return", save_details_and_finish_function(conn, record));

                    case 13:
                    case "end":
                        return _context4.stop();
                }
            }
        }, _callee4, this);
    }));

    return function save_existing(_x6, _x7) {
        return ref.apply(this, arguments);
    };
}();

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

var db = require("./db");
var async = require("async");
var Promise = require("bluebird");
var ormutils = require("./ormutils.js");
var Query = require("./serverquery.js");

Promise.config({
    longStackTraces: true
});
var orm = {};

function raw_insert_row_function(connection, record) {
    var insert = orm.generate_insert_sql(record);
    //console.log(insert.sql)
    return connection.query(insert.sql, insert.values).then(function (info) {
        record.internalId = info.insertId;
        record.syncVersion = 1;
        record.setNewFlag(false);
        record.setModifiedFlag(false);
    });
}

function raw_delete_row_function(connection, record) {
    var del = orm.generate_delete_sql(record);
    //console.log(del.sql)
    //console.log(del.values)
    return connection.query(del.sql, del.values).then(function (info) {
        if (info.affectedRows != 1) {
            throw { code: "ROW_NOT_DELETED", message: "Row couldn't be deleted" };
            return;
        }
    });
}

function raw_update_row_function(connection, record) {
    var update = orm.generate_update_sql(record);
    //console.log(update.sql)
    return connection.query(update.sql, update.values).then(function (info) {
        if (info.changedRows != 1) {
            throw { code: "ROW_NOT_UPDATED", message: "Row couldn't be updated" };
        } else {
            record.setNewFlag(false);
            record.setModifiedFlag(false);
        }
    });
}

function deleteDetailFunction(connection, record, detailname) {
    var detail = record.details(detailname);
    var del = orm.generate_delete_detail_sql(record, detailname);
    //console.log(del.sql)
    //console.log(del.values)
    return connection.query(del.sql, del.values);
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
        resolve();
    }).then(function () {
        return Promise.all(funcs);
    });
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
            values.push(record.fields(fn).getSQLValue());
        }
    }
    var sql = "INSERT INTO " + record.__class__.__description__.name + " (" + fnames.join(",") + ") VALUES (" + questions.join(",") + ")";
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
            values.push(record.fields(fn).getSQLValue());
        }
    }
    where.push("`internalId`=?");
    values.push(record.oldFields("internalId").getSQLValue());
    if (record.hasField("syncVersion")) {
        where.push("`syncVersion`=?");
        values.push(record.oldFields("syncVersion").getSQLValue());
    }
    var sql = "UPDATE " + record.__class__.__description__.name + " SET " + setfields.join(",") + " WHERE " + where.join(" AND ");
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
            });
            cb(null);
            return;
        });
    };
}

function select_detail_function(conn, record, dn) {
    var select = orm.generate_select_detail_sql(record, dn);
    //console.log(select.sql)
    var detail = record.details(dn);
    return conn.query(select.sql, select.values).spread(function (rows, fields) {
        rows.forEach(function (row) {
            var rw = detail.newRow();
            ormutils.fill_record_with_query_result(rw, row, fields);
            detail.push(rw);
            rw.setNewFlag(false);
            rw.setModifiedFlag(false);
        });
    });
}

orm.load2 = function load(record, callback) {
    var conn = null;
    async.series([function (cb) {
        db.pool.getConnection(function (err, val) {
            conn = val;
            if (err && conn) conn.release();
            cb(err);
        });
    }, function (cb) {
        var select = orm.generate_load_sql(record);
        //console.log(select.sql)
        conn.query(select.sql, select.values, function (err, rows, fields) {
            if (err) {
                cb(err);
                return;
            }
            if (rows == 0) {
                cb({ error: "record not found" });
                return;
            }
            ormutils.fill_record_with_query_result(record, rows[0], fields);
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

orm.load = function () {
    var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(record) {
        var conn, select, qres, rows, fields, funcs;
        return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        _context.prev = 0;
                        _context.next = 3;
                        return db.getConnection();

                    case 3:
                        conn = _context.sent;
                        select = orm.generate_load_sql(record);
                        //console.log(select.sql)

                        _context.next = 7;
                        return conn.query(select.sql, select.values);

                    case 7:
                        qres = _context.sent;
                        rows = qres[0], fields = qres[1];

                        if (!(rows == 0)) {
                            _context.next = 11;
                            break;
                        }

                        return _context.abrupt("return", false);

                    case 11:
                        ormutils.fill_record_with_query_result(record, rows[0], fields);
                        record.setNewFlag(false);
                        record.setModifiedFlag(false);

                        funcs = [];

                        record.detailNames().forEach(function (dn) {
                            funcs.push(select_detail_function(conn, record, dn));
                        });
                        _context.next = 18;
                        return Promise.all(funcs);

                    case 18:
                        conn.release();
                        conn = null;
                        record.syncOldFields();
                        return _context.abrupt("return", true);

                    case 22:
                        _context.prev = 22;

                        if (conn != null) {
                            conn.release();
                            conn = null;
                            //console.log(err, conn)
                        }
                        return _context.finish(22);

                    case 25:
                    case "end":
                        return _context.stop();
                }
            }
        }, _callee, this, [[0,, 22, 25]]);
    }));

    function load(_x) {
        return ref.apply(this, arguments);
    }

    return load;
}();

orm.generate_load_sql = function generate_load_sql(record) {
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
    if (where.length == 0) throw new Error("Imposible hacer select sin valores");
    var sql = "SELECT " + snames.join(",") + " FROM " + record.__class__.__description__.name + " WHERE " + where.join(" AND ") + " LIMIT 1";
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

function commit(conn, record) {
    return conn.commit().then(function () {
        record.__clearRemovedRows__();
    });
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
    };
}

function delete_details_and_finish_function(conn, record) {
    var funcs = [];
    return new Promise(function (resolve, reject) {
        for (var i = 0; i < record.detailNames().length; i++) {
            var f = deleteDetailFunction(conn, record, record.detailNames()[i]);
            funcs.push(f);
        }
        resolve();
    }).then(function () {
        return Promise.all(funcs);
    }).then(function () {
        return conn.commit().then(function () {
            record.syncOldFields();
        });
    }, function onReject(err) {
        return rollback(conn, record).then(Promise.reject(err));
    });
}

orm.store = function () {
    var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee5(record, callback) {
        var res, conn, _res, _res2;

        return regeneratorRuntime.wrap(function _callee5$(_context5) {
            while (1) {
                switch (_context5.prev = _context5.next) {
                    case 0:
                        res = true;

                        if (!(!record.isNew() && !record.isModified())) {
                            _context5.next = 3;
                            break;
                        }

                        return _context5.abrupt("return", true);

                    case 3:
                        _context5.prev = 3;
                        _context5.next = 6;
                        return db.getConnection();

                    case 6:
                        conn = _context5.sent;

                        if (!record.isNew()) {
                            _context5.next = 13;
                            break;
                        }

                        _context5.next = 10;
                        return save_new(conn, record);

                    case 10:
                        _res = _context5.sent;
                        _context5.next = 19;
                        break;

                    case 13:
                        if (!record.isModified()) {
                            _context5.next = 19;
                            break;
                        }

                        _context5.next = 16;
                        return save_existing(conn, record);

                    case 16:
                        _res2 = _context5.sent;

                        if (_res2) {
                            _context5.next = 19;
                            break;
                        }

                        return _context5.abrupt("return", _res2);

                    case 19:
                        record.syncOldFields();

                    case 20:
                        _context5.prev = 20;

                        if (conn != null) {
                            conn.release();
                            conn = null;
                        }
                        return _context5.finish(20);

                    case 23:
                        ;
                        return _context5.abrupt("return", true);

                    case 25:
                    case "end":
                        return _context5.stop();
                }
            }
        }, _callee5, this, [[3,, 20, 23]]);
    }));

    function store(_x8, _x9) {
        return ref.apply(this, arguments);
    }

    return store;
}();

orm.delete = function (record) {
    if (record.isNew()) {
        return Promise.reject({
            code: "NOT_DELETED",
            message: "Record is new. Cannot be deleted"
        });
    }
    var conn = null;
    return db.getConnection().then(function (newconn) {
        conn = newconn;
        return conn.beginTransaction();
    }).then(function () {
        var del = orm.generate_delete_sql(record);
        //console.log(del.sql)
        //console.log(del.values)
        return conn.query(del.sql, del.values);
    }).then(function (info) {
        //console.log(info)
        if (info.affectedRows != 1) {
            //console.log(info.affectedRows)
            throw { code: "NOT_DELETED", message: "Record might have been modified by other user." };
        }
        return delete_details_and_finish_function(conn, record);
    }).finally(function (err) {
        if (conn != null) {
            conn.release();
            conn = null;
            //console.log(err, conn)
        }
    });
};

orm.select = function select(recordClass) {
    //return Query.select(recordClass)

    var conn = null;
    return db.getConnection().then(function (newconn) {
        conn = newconn;
        var select = orm.generate_select_sql(recordClass);
        return conn.query(select.sql, select.values);
    }).spread(function (rows, fields) {
        var result = [];
        for (var i = 0; i < rows.length; i++) {
            var record = recordClass.new();
            ormutils.fill_record_with_query_result(record, rows[i], fields);
            result.push(record);
        }
        return result;
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
            //where.push("`" + fn + "` = ?");
            values.push(record[fn]);
        }
    }
    var sql = "SELECT " + snames.join(",") + " FROM " + record.__description__.name; // + " WHERE " + where.join(" AND ") + " LIMIT 1";
    return { sql: sql, values: values };
};

module.exports = orm;

//# sourceMappingURL=orm.js.map