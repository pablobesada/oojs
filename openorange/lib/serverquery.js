"use strict";

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

var BaseQuery = require("./basequery");
var db = require("./db");
var ormutils = require("./ormutils");
var cm = require("./classmanager");
var ctx = require("./contextmanager");

var ServerQuery = Object.create(BaseQuery);

ServerQuery.fetch = function () {
    var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
        var self, sql, conn, _ref, _ref2, rows, fields, result, i, record;

        return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        //console.log("quering")
                        self = this;
                        sql = this.generateSQL();
                        //var conn = null;
                        //var conn = await db.getConnection()

                        _context.next = 4;
                        return ctx.getDBConnection();

                    case 4:
                        conn = _context.sent;
                        _context.next = 7;
                        return conn.query(sql.sql, sql.values);

                    case 7:
                        _ref = _context.sent;
                        _ref2 = _slicedToArray(_ref, 2);
                        rows = _ref2[0];
                        fields = _ref2[1];
                        //var qres = await conn.query(sql.sql, sql.values);

                        result = [];

                        for (i = 0; i < rows.length; i++) {
                            record = self._recordClass.new();

                            ormutils.fill_record_with_query_result(record, rows[i], fields);
                            record.setNewFlag(false);
                            record.setModifiedFlag(false);
                            result.push(record);
                        }
                        for (i = 0; i < result.length; i++) {
                            result[i].syncOldFields();
                        }
                        return _context.abrupt("return", result);

                    case 15:
                    case "end":
                        return _context.stop();
                }
            }
        }, _callee, this);
    }));

    function fetch() {
        return ref.apply(this, arguments);
    }

    return fetch;
}();

/*
ServerQuery.fetch = function fetch() {
    var self = this;
    var sql = this.generateSQL()
    var conn = null;
    return db.getConnection()
        .then(function (newconn) {
            conn = newconn;
            console.log(sql.sql)
            return conn.query(sql.sql, sql.values)
        })
        .spread(function (rows, fields) {
            var result = [];
            for (var i=0;i<rows.length;i++) {
                var record = self._recordClass.new();
                ormutils.fill_record_with_query_result(record, rows[i], fields)
                record.setNewFlag(false);
                record.setModifiedFlag(false);
                result.push(record);
            }
            return result;
        })
        .then(function (result) {
            for (var i=0;i<result.length;i++) {
                result[i].syncOldFields();
            }
            return result;
        })
}*/

ServerQuery.fromJSON = function fromJSON(obj) {
    var query = Object.create(this);
    query._type = obj._type;
    query._fromtable = obj._fromtable;
    query._recordClass = cm.getClass(obj._recordClassName);
    query._projection = obj._projection;
    query._where = obj._where;
    query._orderby = obj._orderby;
    query._limit = obj._limit;
    query._offset = obj._offset;
    return query;
};

module.exports = ServerQuery;

//# sourceMappingURL=serverquery.js.map