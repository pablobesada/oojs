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
                            _context.next = 8;
                            break;
                        }

                        return _context.abrupt("return", true);

                    case 8:
                        return _context.abrupt("return", false);

                    case 9:
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
var cm = require("./classmanager");

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
oo.getRouteManager = function getRouteManager() {
    return require("./runtime");
};
module.exports = oo;

//# sourceMappingURL=openorange.js.map