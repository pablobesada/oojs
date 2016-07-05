"use strict";

var raw_insert_row_function = function () {
    var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(connection, record) {
        var insert, info;
        return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        insert = orm.generate_insert_sql(record);
                        //console.log(insert.sql)

                        _context.next = 3;
                        return connection.query(insert.sql, insert.values);

                    case 3:
                        info = _context.sent;

                        record.internalId = info.insertId;
                        _context.next = 7;
                        return store_sets(connection, record, true, false);

                    case 7:
                        record.syncVersion = 1;
                        record.setNewFlag(false);
                        record.setModifiedFlag(false);

                    case 10:
                    case "end":
                        return _context.stop();
                }
            }
        }, _callee, this);
    }));

    return function raw_insert_row_function(_x, _x2) {
        return ref.apply(this, arguments);
    };
}();

var raw_delete_row_function = function () {
    var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(connection, record) {
        var del, info;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
            while (1) {
                switch (_context2.prev = _context2.next) {
                    case 0:
                        del = orm.generate_delete_sql(record);
                        //console.log(del.sql)
                        //console.log(del.values)

                        _context2.next = 3;
                        return connection.query(del.sql, del.values);

                    case 3:
                        info = _context2.sent;

                        if (!(info.affectedRows != 1)) {
                            _context2.next = 7;
                            break;
                        }

                        throw { code: "ROW_NOT_DELETED", message: "Row couldn't be deleted" };

                    case 7:
                        _context2.next = 9;
                        return store_sets(connection, record, false, true);

                    case 9:
                    case "end":
                        return _context2.stop();
                }
            }
        }, _callee2, this);
    }));

    return function raw_delete_row_function(_x3, _x4) {
        return ref.apply(this, arguments);
    };
}();

var raw_update_row_function = function () {
    var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee3(connection, record) {
        var update, info;
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
            while (1) {
                switch (_context3.prev = _context3.next) {
                    case 0:
                        update = orm.generate_update_sql(record);
                        //console.log(update.sql)

                        _context3.next = 3;
                        return connection.query(update.sql, update.values);

                    case 3:
                        info = _context3.sent;

                        if (!(info.changedRows != 1)) {
                            _context3.next = 8;
                            break;
                        }

                        throw { code: "ROW_NOT_UPDATED", message: "Row couldn't be updated" };

                    case 8:
                        _context3.next = 10;
                        return store_sets(connection, record, false, false);

                    case 10:
                        record.setNewFlag(false);
                        record.setModifiedFlag(false);

                    case 12:
                    case "end":
                        return _context3.stop();
                }
            }
        }, _callee3, this);
    }));

    return function raw_update_row_function(_x5, _x6) {
        return ref.apply(this, arguments);
    };
}();

var deleteDetailFunction = function () {
    var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee4(connection, record, detailname) {
        var detail, del, info, i, row;
        return regeneratorRuntime.wrap(function _callee4$(_context4) {
            while (1) {
                switch (_context4.prev = _context4.next) {
                    case 0:
                        detail = record.details(detailname);
                        del = orm.generate_delete_detail_sql(record, detailname);
                        _context4.next = 4;
                        return connection.query(del.sql, del.values);

                    case 4:
                        info = _context4.sent;
                        i = 0;

                    case 6:
                        if (!(i < detail.length)) {
                            _context4.next = 13;
                            break;
                        }

                        row = detail[i];
                        _context4.next = 10;
                        return store_sets(connection, row, row.isNew(), true);

                    case 10:
                        i++;
                        _context4.next = 6;
                        break;

                    case 13:
                    case "end":
                        return _context4.stop();
                }
            }
        }, _callee4, this);
    }));

    return function deleteDetailFunction(_x7, _x8, _x9) {
        return ref.apply(this, arguments);
    };
}();

var saveDetailFunction = function () {
    var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee5(connection, record, detailname) {
        var funcs;
        return regeneratorRuntime.wrap(function _callee5$(_context5) {
            while (1) {
                switch (_context5.prev = _context5.next) {
                    case 0:
                        funcs = [];
                        return _context5.abrupt("return", new Promise(function (resolve, reject) {
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
                            for (var _i = 0; _i < detail.__removed_rows__.length; _i++) {
                                var _row = detail.__removed_rows__[_i];
                                if (!_row.isNew()) {
                                    funcs.push(raw_delete_row_function(connection, _row));
                                }
                            }
                            resolve();
                        }).then(function () {
                            return Promise.all(funcs);
                        }));

                    case 2:
                    case "end":
                        return _context5.stop();
                }
            }
        }, _callee5, this);
    }));

    return function saveDetailFunction(_x10, _x11, _x12) {
        return ref.apply(this, arguments);
    };
}();

var save_details_and_finish_function = function () {
    var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee7(conn, record) {
        var funcs;
        return regeneratorRuntime.wrap(function _callee7$(_context7) {
            while (1) {
                switch (_context7.prev = _context7.next) {
                    case 0:
                        _context7.prev = 0;
                        funcs = [];
                        _context7.next = 4;
                        return new Promise(function (resolve, reject) {
                            for (var i = 0; i < record.persistentDetailNames().length; i++) {
                                var f = saveDetailFunction(conn, record, record.persistentDetailNames()[i]);
                                funcs.push(f);
                            }
                            resolve();
                        });

                    case 4:
                        _context7.next = 6;
                        return Promise.all(funcs);

                    case 6:
                        return _context7.abrupt("return", true);

                    case 9:
                        _context7.prev = 9;
                        _context7.t0 = _context7["catch"](0);

                        if (_context7.t0.stack) console.log(_context7.t0.stack);
                        return _context7.abrupt("return", false);

                    case 13:
                    case "end":
                        return _context7.stop();
                }
            }
        }, _callee7, this, [[0, 9]]);
    }));

    return function save_details_and_finish_function(_x14, _x15) {
        return ref.apply(this, arguments);
    };
}();

var store_sets = function () {
    var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee8(conn, record, isNewRecord, isDeleting) {
        var promises, fieldnames, i, field, oldvalue, sql, values, _fieldnames, _i2, _field, setvalues, j, _sql, _values;

        return regeneratorRuntime.wrap(function _callee8$(_context8) {
            while (1) {
                switch (_context8.prev = _context8.next) {
                    case 0:
                        promises = [];

                        if (!isNewRecord) {
                            fieldnames = record.fieldNames();

                            for (i = 0; i < fieldnames.length; i++) {
                                field = record.fields(fieldnames[i]);
                                oldvalue = record.oldFields(fieldnames[i]).getValue();

                                if (field.type == 'set' && field.setrecordname && oldvalue != null && oldvalue != '' && (field.getValue() != oldvalue || isDeleting)) {
                                    sql = "DELETE FROM " + field.setrecordname + " WHERE masterId=?";
                                    values = [record.oldFields("internalId").getValue()];

                                    promises.push(conn.query(sql, values));
                                }
                            }
                        }
                        if (!isDeleting) {
                            _fieldnames = record.fieldNames();

                            for (_i2 = 0; _i2 < _fieldnames.length; _i2++) {
                                _field = record.fields(_fieldnames[_i2]);

                                if (_field.type == 'set' && _field.setrecordname && _field.getValue() != null) {
                                    setvalues = _(_field.getValue().split(",")).map(function (v) {
                                        return v.trim();
                                    });

                                    for (j = 0; j < setvalues.length; j++) {
                                        _sql = "INSERT INTO " + _field.setrecordname + " (masterId, Value, syncVersion) values (?,?,?)";
                                        _values = [record.internalId, setvalues[j], 1];

                                        promises.push(conn.query(_sql, _values));
                                    }
                                }
                            }
                        }
                        return _context8.abrupt("return", Promise.all(promises));

                    case 4:
                    case "end":
                        return _context8.stop();
                }
            }
        }, _callee8, this);
    }));

    return function store_sets(_x16, _x17, _x18, _x19) {
        return ref.apply(this, arguments);
    };
}();

var save_new = function () {
    var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee9(conn, record) {
        var insert, info;
        return regeneratorRuntime.wrap(function _callee9$(_context9) {
            while (1) {
                switch (_context9.prev = _context9.next) {
                    case 0:
                        //await conn.beginTransaction()
                        insert = orm.generate_insert_sql(record);
                        _context9.next = 3;
                        return conn.query(insert.sql, insert.values);

                    case 3:
                        info = _context9.sent;

                        record.internalId = info.insertId;
                        record.syncVersion = 1;
                        _context9.next = 8;
                        return store_sets(conn, record, true, false);

                    case 8:
                        record.setNewFlag(false);
                        record.setModifiedFlag(false);
                        return _context9.abrupt("return", save_details_and_finish_function(conn, record));

                    case 11:
                    case "end":
                        return _context9.stop();
                }
            }
        }, _callee9, this);
    }));

    return function save_new(_x20, _x21) {
        return ref.apply(this, arguments);
    };
}();

var save_existing = function () {
    var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee10(conn, record) {
        var update, info;
        return regeneratorRuntime.wrap(function _callee10$(_context10) {
            while (1) {
                switch (_context10.prev = _context10.next) {
                    case 0:
                        //await conn.beginTransaction();
                        update = orm.generate_update_sql(record);
                        _context10.next = 3;
                        return conn.query(update.sql, update.values);

                    case 3:
                        info = _context10.sent;

                        if (!(info.changedRows != 1)) {
                            _context10.next = 7;
                            break;
                        }

                        console.log({ code: "WRONG_SYNCVERSION", message: "Record might have been modified by other user " });
                        return _context10.abrupt("return", false);

                    case 7:
                        record.syncVersion += 1;
                        record.setNewFlag(false);
                        _context10.next = 11;
                        return store_sets(conn, record, false, false);

                    case 11:
                        record.setModifiedFlag(false);
                        return _context10.abrupt("return", save_details_and_finish_function(conn, record));

                    case 13:
                    case "end":
                        return _context10.stop();
                }
            }
        }, _callee10, this);
    }));

    return function save_existing(_x22, _x23) {
        return ref.apply(this, arguments);
    };
}();

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

var _ = require("underscore");
var db = require("./db");
var async = require("async");
var Promise = require("bluebird");
var ormutils = require("./ormutils.js");
var Query = require("./serverquery.js");
var ctx = require("./contextmanager.js");

Promise.config({
    longStackTraces: true
});
var orm = {};

/*.catch(function (err) {
  console.log(err)
})*/


orm.generate_insert_sql = function generate_insert_sql(record) {
    var fieldnames = record.persistentFieldNames();
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
    var fieldnames = record.persistentFieldNames();
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

orm.generate_delete_sql = function generate_delete_sql(record) {
    var values = [];
    var where = [];
    where.push("`internalId`=?");
    values.push(record.internalId);
    if (record.hasField("syncVersion")) {
        where.push("`syncVersion`=?");
        values.push(record.syncVersion);
    }
    var sql = "DELETE FROM " + record.__class__.getDescription().name + " WHERE " + where.join(" AND ");
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

orm.load = function () {
    var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee6(record) {
        var conn, select, qres, rows, fields, funcs;
        return regeneratorRuntime.wrap(function _callee6$(_context6) {
            while (1) {
                switch (_context6.prev = _context6.next) {
                    case 0:
                        _context6.prev = 0;
                        _context6.next = 3;
                        return ctx.getDBConnection();

                    case 3:
                        conn = _context6.sent;
                        select = orm.generate_load_sql(record);
                        //console.log(select.sql)

                        _context6.next = 7;
                        return conn.query(select.sql, select.values);

                    case 7:
                        qres = _context6.sent;
                        rows = qres[0], fields = qres[1];

                        if (!(rows == 0)) {
                            _context6.next = 11;
                            break;
                        }

                        return _context6.abrupt("return", false);

                    case 11:
                        ormutils.fill_record_with_query_result(record, rows[0], fields);
                        record.setNewFlag(false);
                        record.setModifiedFlag(false);

                        funcs = [];

                        record.persistentDetailNames().forEach(function (dn) {
                            funcs.push(select_detail_function(conn, record, dn));
                        });
                        _context6.next = 18;
                        return Promise.all(funcs);

                    case 18:
                        //conn.release();
                        //conn = null;
                        record.syncOldFields();
                        return _context6.abrupt("return", true);

                    case 20:
                        _context6.prev = 20;
                        return _context6.finish(20);

                    case 22:
                    case "end":
                        return _context6.stop();
                }
            }
        }, _callee6, this, [[0,, 20, 22]]);
    }));

    function load(_x13) {
        return ref.apply(this, arguments);
    }

    return load;
}();

//if (conn != null) {
//    conn.release()
//    conn = null;
//console.log(err, conn)
//}
orm.generate_load_sql = function generate_load_sql(record) {
    var fieldnames = record.persistentFieldNames();
    var questions = [];
    var values = [];
    var snames = [];
    var where = [];

    for (var i = 0; i < fieldnames.length; i++) {
        var fn = fieldnames[i];
        snames.push("`" + fn + "`");
        var value = record.fields(fn).getSQLValue();
        if (value != null) {
            where.push("`" + fn + "` = ?");
            values.push(value);
        }
    }
    var sql = "SELECT " + snames.join(",") + " FROM " + record.__class__.__description__.name + " WHERE " + where.join(" AND ") + " LIMIT 1";
    if (where.length == 0) {
        console.log(sql);
        throw new Error("Imposible hacer select sin valores");
    }
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

function delete_details_and_finish_function(conn, record) {
    var funcs = [];
    return new Promise(function (resolve, reject) {
        for (var i = 0; i < record.persistentDetailNames().length; i++) {
            var f = deleteDetailFunction(conn, record, record.persistentDetailNames()[i]);
            funcs.push(f);
        }
        resolve();
    }).then(function () {
        return Promise.all(funcs);
    }).then(function () {
        record.syncOldFields();
        //return conn.commit().then(function () {
        //
        //})
    }, function onReject(err) {
        Promise.reject(err);
    });
}

orm.store = function () {
    var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee11(record, callback) {
        var res, conn, _res, _res2;

        return regeneratorRuntime.wrap(function _callee11$(_context11) {
            while (1) {
                switch (_context11.prev = _context11.next) {
                    case 0:
                        res = true;

                        if (!(!record.isPersistent() || !record.isNew() && !record.isModified())) {
                            _context11.next = 3;
                            break;
                        }

                        return _context11.abrupt("return", true);

                    case 3:
                        _context11.prev = 3;
                        _context11.next = 6;
                        return ctx.getDBConnection();

                    case 6:
                        conn = _context11.sent;

                        if (!record.isNew()) {
                            _context11.next = 15;
                            break;
                        }

                        _context11.next = 10;
                        return save_new(conn, record);

                    case 10:
                        _res = _context11.sent;

                        if (_res) {
                            _context11.next = 13;
                            break;
                        }

                        return _context11.abrupt("return", _res);

                    case 13:
                        _context11.next = 21;
                        break;

                    case 15:
                        if (!record.isModified()) {
                            _context11.next = 21;
                            break;
                        }

                        _context11.next = 18;
                        return save_existing(conn, record);

                    case 18:
                        _res2 = _context11.sent;

                        if (_res2) {
                            _context11.next = 21;
                            break;
                        }

                        return _context11.abrupt("return", _res2);

                    case 21:
                        _context11.next = 29;
                        break;

                    case 23:
                        _context11.prev = 23;
                        _context11.t0 = _context11["catch"](3);
                        _context11.next = 27;
                        return conn.rollback();

                    case 27:
                        if (_context11.t0.stack) console.log(_context11.t0.stack);
                        throw _context11.t0;

                    case 29:
                        return _context11.abrupt("return", true);

                    case 30:
                    case "end":
                        return _context11.stop();
                }
            }
        }, _callee11, this, [[3, 23]]);
    }));

    function store(_x24, _x25) {
        return ref.apply(this, arguments);
    }

    return store;
}();

orm.delete = function () {
    var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee12(record) {
        var conn, del, info;
        return regeneratorRuntime.wrap(function _callee12$(_context12) {
            while (1) {
                switch (_context12.prev = _context12.next) {
                    case 0:
                        if (!record.isNew()) {
                            _context12.next = 2;
                            break;
                        }

                        return _context12.abrupt("return", Promise.reject({
                            code: "NOT_DELETED",
                            message: "Record is new. Cannot be deleted"
                        }));

                    case 2:
                        _context12.next = 4;
                        return ctx.getDBConnection();

                    case 4:
                        conn = _context12.sent;
                        del = orm.generate_delete_sql(record);
                        _context12.next = 8;
                        return conn.query(del.sql, del.values);

                    case 8:
                        info = _context12.sent;

                        if (!(info.affectedRows != 1)) {
                            _context12.next = 11;
                            break;
                        }

                        throw { code: "NOT_DELETED", message: "Record might have been modified by other user." };

                    case 11:
                        _context12.next = 13;
                        return store_sets(conn, record, false, true);

                    case 13:
                        return _context12.abrupt("return", delete_details_and_finish_function(conn, record));

                    case 14:
                    case "end":
                        return _context12.stop();
                }
            }
        }, _callee12, this);
    }));

    return function (_x26) {
        return ref.apply(this, arguments);
    };
}();

orm.select = function select(recordClass) {
    //return Query.select(recordClass)

    var conn = null;
    //return db.getConnection()
    return ctx.getDBConnection().then(function (newconn) {
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