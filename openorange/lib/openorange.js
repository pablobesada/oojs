"use strict";

var login = function () {
    var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(usercode, md5pass) {
        var user;
        return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        if (!(!usercode || usercode == '')) {
                            _context.next = 2;
                            break;
                        }

                        return _context.abrupt("return", false);

                    case 2:
                        if (!md5pass) md5pass = '';
                        _context.next = 5;
                        return cm.getClass("User").findOne({ Code: usercode, Password: md5pass });

                    case 5:
                        user = _context.sent;

                        if (!user) {
                            _context.next = 9;
                            break;
                        }

                        oo.connectedClient.broadcast('postMessage', "El usuario " + usercode + " se acaba de loguear");
                        return _context.abrupt("return", true);

                    case 9:
                        return _context.abrupt("return", false);

                    case 10:
                    case "end":
                        return _context.stop();
                }
            }
        }, _callee, this);
    }));

    return function login(_x, _x2) {
        return ref.apply(this, arguments);
    };
}();

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

require("babel-polyfill");
var cm = require("./classmanager").init();

var oo = {};
oo.isServer = true;
oo.isClient = !oo.isServer;
oo.classmanager = cm;
oo.orm = require("./orm");
oo.query = require("./serverquery");
oo.explorer = require("./both/explorer");
//context related accessors
oo.contextmanager = require("./contextmanager");
//context db accessors
oo.getDBConnection = oo.contextmanager.getDBConnection.bind(oo.contextmanager);
oo.beginTransaction = oo.contextmanager.beginTransaction.bind(oo.contextmanager);
oo.commit = oo.contextmanager.commit.bind(oo.contextmanager);
oo.rollback = oo.contextmanager.rollback.bind(oo.contextmanager);
//context user accessors
oo.currentUser = oo.contextmanager.currentUser.bind(oo.contextmanager);
oo.login = login;
oo.getRouter = function getRouter() {
    return require("./router");
};
oo.setSocketIO = function (socketIO) {
    oo.connectedClient = require('./pushserver')(socketIO);
};

oo.askYesNo = function () {
    var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(txt) {
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
            while (1) {
                switch (_context2.prev = _context2.next) {
                    case 0:
                        return _context2.abrupt("return", oo.connectedClient.ask('askYesNo', txt));

                    case 1:
                    case "end":
                        return _context2.stop();
                }
            }
        }, _callee2, this);
    }));

    return function (_x3) {
        return ref.apply(this, arguments);
    };
}();
oo.inputString = function () {
    var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee3(txt) {
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
            while (1) {
                switch (_context3.prev = _context3.next) {
                    case 0:
                        return _context3.abrupt("return", oo.connectedClient.ask('inputString', txt));

                    case 1:
                    case "end":
                        return _context3.stop();
                }
            }
        }, _callee3, this);
    }));

    return function (_x4) {
        return ref.apply(this, arguments);
    };
}();
oo.alert = function () {
    var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee4(txt) {
        return regeneratorRuntime.wrap(function _callee4$(_context4) {
            while (1) {
                switch (_context4.prev = _context4.next) {
                    case 0:
                        return _context4.abrupt("return", oo.connectedClient.ask('alert', txt));

                    case 1:
                    case "end":
                        return _context4.stop();
                }
            }
        }, _callee4, this);
    }));

    return function (_x5) {
        return ref.apply(this, arguments);
    };
}();
oo.postMessage = function () {
    var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee5(txt) {
        return regeneratorRuntime.wrap(function _callee5$(_context5) {
            while (1) {
                switch (_context5.prev = _context5.next) {
                    case 0:
                        return _context5.abrupt("return", oo.connectedClient.ask('postMessage', txt));

                    case 1:
                    case "end":
                        return _context5.stop();
                }
            }
        }, _callee5, this);
    }));

    return function (_x6) {
        return ref.apply(this, arguments);
    };
}();

module.exports = oo;

//# sourceMappingURL=openorange.js.map