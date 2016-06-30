"use strict";

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

var should = require('should');
var chance = new require("chance")();
var oo = require("openorange");
var query = oo.query;
var cm = oo.classmanager;

describe("Explorer", function () {
    var _this = this;

    it("It should find TestRecord", _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
        var res;
        return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        _context.next = 2;
                        return oo.explorer.findAllModules();

                    case 2:
                        res = _context.sent;

                        console.log("RES", res);

                    case 4:
                    case "end":
                        return _context.stop();
                }
            }
        }, _callee, _this);
    })));
});

//# sourceMappingURL=ExplorerTest.js.map