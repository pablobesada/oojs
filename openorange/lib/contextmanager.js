'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var continuationLocalStorage = require('continuation-local-storage');
var contextSession = continuationLocalStorage.createNamespace('contextSession');

var ContextManager = function () {
    function ContextManager() {
        _classCallCheck(this, ContextManager);
    }

    _createClass(ContextManager, null, [{
        key: 'expressMiddleware',
        value: function expressMiddleware() {

            return function (req, res, next) {
                contextSession.bindEmitter(req);
                contextSession.bindEmitter(res);
                //console.log("en middleware")
                contextSession.run(function () {
                    //console.log("en middleware 2", req.session, req.session.user)
                    //console.log("req.sessionID: ", req.sessionID, "   session.id: " + req.session.id)
                    contextSession.set('session', req.session);

                    next();
                });
            };
        }
    }, {
        key: 'getSession',
        value: function getSession() {
            return contextSession.get('session') || { id: '123' };
        }
    }, {
        key: 'getDBConnection',
        value: function () {
            var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
                var session, connections, i, _conn, conn;

                return regeneratorRuntime.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                session = this.getSession();

                                console.log("SID: " + session.id);
                                if (!this.dbconnections[session.id]) this.dbconnections[session.id] = [];
                                connections = this.dbconnections[session.id];
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

                                this.dbconnections[session.id].push(conn);
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
    }]);

    return ContextManager;
}();

ContextManager.dbconnections = {};

module.exports = ContextManager;

//# sourceMappingURL=contextmanager.js.map