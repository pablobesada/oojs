'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var continuationLocalStorage = require('continuation-local-storage');
var context = continuationLocalStorage.createNamespace('openorange-async-session-context');

var ContextManager = function () {
    function ContextManager() {
        _classCallCheck(this, ContextManager);
    }

    _createClass(ContextManager, null, [{
        key: 'expressMiddleware',
        value: function expressMiddleware() {

            return function (req, res, next) {
                context.bindEmitter(req);
                context.bindEmitter(res);
                //console.log("en middleware")
                context.run(function () {
                    context.set('request-session', req.session);
                    next();
                });
            };
        }
    }, {
        key: 'socketIOMiddleware',
        value: function socketIOMiddleware() {
            return function (socket, next) {
                context.run(function () {
                    context.set('request-session', socket.request.session);
                    next();
                });
            };
        }
    }, {
        key: 'getContext',
        value: function getContext() {
            return context;
        }
    }, {
        key: 'recoverContext',
        value: function recoverContext(session) {
            continuationLocalStorage.getNamespace('openorange-async-session-context').set('request-session', session);
            //context.set('request-session', session);
        }
    }, {
        key: 'getRequestSession',
        value: function getRequestSession() {
            return context.get('request-session') || { id: 'local-session' };
        }
    }, {
        key: 'getDBConnection',
        value: function () {
            var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
                var session, sid, connections, i, _conn, conn;

                return regeneratorRuntime.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                session = this.getRequestSession();
                                //console.log("SID: " + session.id)

                                sid = session.id;
                                //sid = '123'

                                if (!this.dbconnections[sid]) this.dbconnections[sid] = [];
                                connections = this.dbconnections[sid];
                                _context.t0 = regeneratorRuntime.keys(connections);

                            case 5:
                                if ((_context.t1 = _context.t0()).done) {
                                    _context.next = 12;
                                    break;
                                }

                                i = _context.t1.value;
                                _conn = connections[i];

                                if (_conn.busy) {
                                    _context.next = 10;
                                    break;
                                }

                                return _context.abrupt('return', _conn);

                            case 10:
                                _context.next = 5;
                                break;

                            case 12:
                                _context.next = 14;
                                return require("./db").getConnection();

                            case 14:
                                conn = _context.sent;

                                this.dbconnections[sid].push(conn);
                                return _context.abrupt('return', conn);

                            case 17:
                            case 'end':
                                return _context.stop();
                        }
                    }
                }, _callee, this);
            }));

            function getDBConnection() {
                return ref.apply(this, arguments);
            }

            return getDBConnection;
        }()
    }, {
        key: 'beginTransaction',
        value: function () {
            var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee2() {
                var conn;
                return regeneratorRuntime.wrap(function _callee2$(_context2) {
                    while (1) {
                        switch (_context2.prev = _context2.next) {
                            case 0:
                                _context2.next = 2;
                                return this.getDBConnection();

                            case 2:
                                conn = _context2.sent;
                                return _context2.abrupt('return', conn.beginTransaction());

                            case 4:
                            case 'end':
                                return _context2.stop();
                        }
                    }
                }, _callee2, this);
            }));

            function beginTransaction() {
                return ref.apply(this, arguments);
            }

            return beginTransaction;
        }()
    }, {
        key: 'commit',
        value: function () {
            var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee3() {
                var conn;
                return regeneratorRuntime.wrap(function _callee3$(_context3) {
                    while (1) {
                        switch (_context3.prev = _context3.next) {
                            case 0:
                                _context3.next = 2;
                                return this.getDBConnection();

                            case 2:
                                conn = _context3.sent;
                                return _context3.abrupt('return', conn.commit());

                            case 4:
                            case 'end':
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
        key: 'rollback',
        value: function () {
            var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee4() {
                var conn;
                return regeneratorRuntime.wrap(function _callee4$(_context4) {
                    while (1) {
                        switch (_context4.prev = _context4.next) {
                            case 0:
                                _context4.next = 2;
                                return this.getDBConnection();

                            case 2:
                                conn = _context4.sent;
                                return _context4.abrupt('return', conn.rollback());

                            case 4:
                            case 'end':
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
        key: 'currentUser',
        value: function currentUser() {
            var session = this.getRequestSession();
            return session.user;
        }
    }]);

    return ContextManager;
}();

ContextManager.dbconnections = {}; ///cuando se liberan borran las connectiosn de este map???

module.exports = ContextManager;

//# sourceMappingURL=contextmanager.js.map