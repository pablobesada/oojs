"use strict";
"user strict";

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

var should = require('should');
var chance = new require("chance")();
var oo = require("openorange");
var query = oo.query;
var cm = oo.classmanager;
var md5 = require('js-md5');

describe("Login", function () {
    var _this = this;

    var User = cm.getClass("User");
    it("Failed login", _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
        var res;
        return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        _context.next = 2;
                        return oo.login(chance.word({ length: 200 }), chance.word({ length: 200 }));

                    case 2:
                        res = _context.sent;

                        should(res).be.false("esta permitiendo login para un usuario y claves inexistentes");
                        _context.next = 6;
                        return oo.login(chance.word({ length: 200 }), null);

                    case 6:
                        res = _context.sent;

                        should(res).be.false("esta permitiendo login para un usuario inexistente y clave nula");
                        _context.next = 10;
                        return oo.login(null, null);

                    case 10:
                        res = _context.sent;

                        should(res).be.false("esta permitiendo login para un usuario y clave nulos");
                        _context.next = 14;
                        return oo.login('', '');

                    case 14:
                        res = _context.sent;

                        should(res).be.false("esta permitiendo login para un usuario y clave con string vacios");

                    case 16:
                    case "end":
                        return _context.stop();
                }
            }
        }, _callee, _this);
    })));

    it("Successful login", _asyncToGenerator(regeneratorRuntime.mark(function _callee2() {
        var u, res;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
            while (1) {
                switch (_context2.prev = _context2.next) {
                    case 0:
                        _context2.prev = 0;

                        oo.beginTransaction();
                        u = User.new();

                        u.Code = chance.word({ length: 10 });
                        u.pass = chance.word({ length: 20 });
                        u.Password = md5(u.pass);
                        _context2.next = 8;
                        return u.store();

                    case 8:
                        res = _context2.sent;

                        should(res).be.true();
                        _context2.next = 12;
                        return oo.login(u.Code, u.Password);

                    case 12:
                        res = _context2.sent;

                        should(res).be.true();
                        _context2.next = 16;
                        return oo.login(u.Code, u.pass);

                    case 16:
                        res = _context2.sent;

                        should(res).be.false();
                        _context2.next = 20;
                        return oo.login(u.Code, null);

                    case 20:
                        res = _context2.sent;

                        should(res).be.false();
                        _context2.next = 24;
                        return oo.login(u.Code, '');

                    case 24:
                        res = _context2.sent;

                        should(res).be.false();

                    case 26:
                        _context2.prev = 26;

                        oo.rollback();
                        return _context2.finish(26);

                    case 29:
                    case "end":
                        return _context2.stop();
                }
            }
        }, _callee2, _this, [[0,, 26, 29]]);
    })));
});

//# sourceMappingURL=LoginTest.js.map