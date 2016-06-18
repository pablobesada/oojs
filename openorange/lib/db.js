"use strict";
//require('source-map-support').install();

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

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

var Connection = Object.create(null);

Connection.init = function init(conn) {
    this.__conn__ = conn;
    this.beginTransaction = this.beginTransaction.bind(this);
    this.commit = this.commit.bind(this);
    this.rollback = this.rollback.bind(this);
    return this;
};

Connection.beginTransaction = function () {
    var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
        var self;
        return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        self = this;
                        return _context.abrupt("return", new Promise(function (resolve, reject) {
                            self.__conn__.beginTransaction(function (err) {
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
}();

Connection.query = function () {
    var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(sql, values) {
        var self;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
            while (1) {
                switch (_context2.prev = _context2.next) {
                    case 0:
                        self = this;
                        return _context2.abrupt("return", new Promise(function (resolve, reject) {
                            //console.log(sql, values)
                            self.__conn__.query(sql, values, function (err, result, fields) {
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
}();

Connection.commit = function () {
    var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee3() {
        var self;
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
            while (1) {
                switch (_context3.prev = _context3.next) {
                    case 0:
                        self = this;
                        return _context3.abrupt("return", new Promise(function (resolve, reject) {
                            self.__conn__.commit(function (err) {
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
}();

Connection.rollback = function () {
    var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee4() {
        var self;
        return regeneratorRuntime.wrap(function _callee4$(_context4) {
            while (1) {
                switch (_context4.prev = _context4.next) {
                    case 0:
                        self = this;
                        return _context4.abrupt("return", new Promise(function (resolve, reject) {
                            self.__conn__.rollback(function (err) {
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
}();

Connection.release = function release() {
    var self = this;
    self.__conn__.release();
    self.__conn__ = null;
    //console.log("releasing connection");
};

db.getConnection = function () {
    var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee5() {
        return regeneratorRuntime.wrap(function _callee5$(_context5) {
            while (1) {
                switch (_context5.prev = _context5.next) {
                    case 0:
                        return _context5.abrupt("return", new Promise(function (resolve, reject) {
                            db.pool.getConnection(function (err, connection) {
                                if (err) {
                                    if (connection) {
                                        connnection.release();
                                    }
                                    reject(err);
                                    return;
                                }
                                //console.log("returning new connection");
                                resolve(Object.create(Connection).init(connection));
                            });
                        }));

                    case 1:
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