"use strict";

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

var app = require("./../../app");
var chance = new require("chance")();
var _ = require("underscore");
var oo = require("openorange");
var Query = oo.query;
var cm = oo.classmanager;
var should = require('should');
var async = require('async');
var utils = require("../utils");

describe("Report", function () {
    var _this = this;

    it("create a report", _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
        var report;
        return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        report = cm.getClass("CustomerListReport").new();

                        console.log(report.__class__);
                        //await report.run()
                        //console.log(report.getHTML())

                    case 2:
                    case "end":
                        return _context.stop();
                }
            }
        }, _callee, _this);
    })));
});

//# sourceMappingURL=ReportTest.js.map