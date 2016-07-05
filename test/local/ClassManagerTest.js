"use strict";

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

var should = require('should');
var chance = new require("chance")();
var oo = require("openorange");
var query = oo.query;
var cm = oo.classmanager;

describe("ClassManager", function () {
    var _this = this;

    it("getClass", _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
        return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        should(cm.getClass("TestRecord2").getDescription().name).be.equal('TestRecord2');

                    case 1:
                    case "end":
                        return _context.stop();
                }
            }
        }, _callee, _this);
    })));

    it("getClass - Inheritance", _asyncToGenerator(regeneratorRuntime.mark(function _callee2() {
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
            while (1) {
                switch (_context2.prev = _context2.next) {
                    case 0:
                        should(cm.getClass("TestRecord2").__super__ === cm.getClass("TestRecord")).be.ok();
                        should(cm.getClass("TestRecord").__super__ === cm.getClass("Record")).be.ok();
                        should(cm.getClass("Record").__super__ === cm.getClass("Embedded_Record")).be.ok();

                    case 3:
                    case "end":
                        return _context2.stop();
                }
            }
        }, _callee2, _this);
    })));
});

//# sourceMappingURL=ClassManagerTest.js.map