"use strict";
//require('source-map-support').install();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Promise = require("bluebird");
/*Promise.config({
 longStackTraces: true
 })*/
var mysql = require('mysql');
// Note that the library's classes are not properties of the main export
// so we require and promisifyAll them manually
//Promise.promisifyAll(require("mysql/lib/Connection").prototype);
//var mysql_pool = Promise.promisifyAll(require("mysql/lib/Pool").prototype);
//var mysql     =    require('mysql');
var db = {};

db.pool = mysql.createPool({
    connectionLimit: 100, //important
    host: 'localhost',
    user: 'root',
    password: 'rootXy',
    database: 'oo',
    debug: false
});

function handle_database(req, res) {

    pool.getConnection(function (err, connection) {
        if (err) {
            connection.release();
            res.json({ "code": 100, "status": "Error in connection database" });
            return;
        }

        console.log('connected as id ' + connection.threadId);

        connection.query("select * from user", function (err, rows) {
            connection.release();
            if (!err) {
                res.json(rows);
            }
        });

        connection.on('error', function (err) {
            res.json({ "code": 100, "status": "Error in connection database" });
            return;
        });
    });
}

var Connection = function () {
    function Connection(conn) {
        _classCallCheck(this, Connection);

        this.id = Connection.__nextid__++;
        this.log_queries = true;
        this.log_query_values = true;
        this.__conn__ = conn;
        this.busy = false;
        if (this.log_queries) console.log("(" + this.id + ") NEW connnection");
        return this;
    }

    _createClass(Connection, [{
        key: "beginTransaction",
        value: function () {
            var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
                var self;
                return regeneratorRuntime.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                self = this;
                                return _context.abrupt("return", new Promise(function (resolve, reject) {
                                    if (self.log_queries) console.log("(" + self.id + ") BEGIN TRANSACTION");
                                    self.busy = true;
                                    self.__conn__.beginTransaction(function (err) {
                                        self.busy = false;
                                        if (err) {
                                            reject(err);
                                            return;
                                        }
                                        resolve();
                                    });
                                }));

                            case 2:
                            case "end":
                                return _context.stop();
                        }
                    }
                }, _callee, this);
            }));

            function beginTransaction() {
                return ref.apply(this, arguments);
            }

            return beginTransaction;
        }()
    }, {
        key: "query",
        value: function () {
            var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(sql, values) {
                var self;
                return regeneratorRuntime.wrap(function _callee2$(_context2) {
                    while (1) {
                        switch (_context2.prev = _context2.next) {
                            case 0:
                                self = this;
                                return _context2.abrupt("return", new Promise(function (resolve, reject) {
                                    if (self.log_queries) console.log("(" + self.id + ") " + sql);
                                    if (self.log_query_values) console.log(values);
                                    self.busy = true;
                                    self.__conn__.query(sql, values, function (err, result, fields) {
                                        self.busy = false;
                                        if (err) {
                                            console.log(err);
                                            console.log(sql);
                                            console.log(values);
                                            reject(err);
                                            return;
                                        }
                                        if (fields != null) {
                                            //SELECTS por ejemplo
                                            resolve([result, fields]);
                                        } else {
                                            //UPDATES POR EJEMPLO
                                            resolve(result);
                                        }
                                    });
                                }));

                            case 2:
                            case "end":
                                return _context2.stop();
                        }
                    }
                }, _callee2, this);
            }));

            function query(_x, _x2) {
                return ref.apply(this, arguments);
            }

            return query;
        }()
    }, {
        key: "commit",
        value: function () {
            var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee3() {
                var self;
                return regeneratorRuntime.wrap(function _callee3$(_context3) {
                    while (1) {
                        switch (_context3.prev = _context3.next) {
                            case 0:
                                self = this;
                                return _context3.abrupt("return", new Promise(function (resolve, reject) {
                                    if (self.log_queries) console.log("(" + self.id + ") COMMIT");
                                    self.busy = true;
                                    self.__conn__.commit(function (err) {
                                        self.busy = false;
                                        if (err) {
                                            reject(err);
                                            return;
                                        }
                                        resolve();
                                    });
                                }));

                            case 2:
                            case "end":
                                return _context3.stop();
                        }
                    }
                }, _callee3, this);
            }));

            function commit() {
                return ref.apply(this, arguments);
            }

            return commit;
        }()
    }, {
        key: "rollback",
        value: function () {
            var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee4() {
                var self;
                return regeneratorRuntime.wrap(function _callee4$(_context4) {
                    while (1) {
                        switch (_context4.prev = _context4.next) {
                            case 0:
                                self = this;
                                return _context4.abrupt("return", new Promise(function (resolve, reject) {
                                    if (self.log_queries) console.log("(" + self.id + ") ROLLBACK");
                                    self.busy = true;
                                    self.__conn__.rollback(function (err) {
                                        self.busy = false;
                                        if (err) {
                                            reject(err);
                                            return;
                                        }
                                        resolve();
                                    });
                                }));

                            case 2:
                            case "end":
                                return _context4.stop();
                        }
                    }
                }, _callee4, this);
            }));

            function rollback() {
                return ref.apply(this, arguments);
            }

            return rollback;
        }()
    }, {
        key: "release",
        value: function release() {
            var self = this;
            if (self.log_queries) console.log("(" + self.id + ") RELEASING connnection");
            self.__conn__.release();
            self.__conn__ = null;
            //console.log("releasing connection");
        }
    }]);

    return Connection;
}();

Connection.__nextid__ = 1;

db.getConnection = function () {
    var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee5() {
        var self;
        return regeneratorRuntime.wrap(function _callee5$(_context5) {
            while (1) {
                switch (_context5.prev = _context5.next) {
                    case 0:
                        self = this;
                        return _context5.abrupt("return", new Promise(function (resolve, reject) {
                            db.pool.getConnection(function (err, connection) {
                                if (err) {
                                    if (connection) {
                                        connnection.release();
                                    }
                                    reject(err);
                                    return;
                                }
                                var res = new Connection(connection);
                                if (!connection.reusing) {
                                    connection.reusing = true;
                                    res.query("SET SESSION TRANSACTION ISOLATION LEVEL REPEATABLE READ").then(function () {
                                        return res.query("SET AUTOCOMMIT=0;");
                                    }).then(function () {
                                        resolve(res);
                                    });
                                } else {
                                    resolve(res);
                                }
                            });
                        }));

                    case 2:
                    case "end":
                        return _context5.stop();
                }
            }
        }, _callee5, this);
    }));

    function getConnection() {
        return ref.apply(this, arguments);
    }

    return getConnection;
}();

module.exports = db;

//# sourceMappingURL=db.js.map