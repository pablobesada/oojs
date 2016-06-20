"use strict";
//var app = require("./../../app")

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

var chance = new require("chance")();
var _ = require("underscore");
var oo = require("openorange");
var Query = oo.query;
var cm = oo.classmanager;
var should = require('should');
var async = require('async');
var utils = null;
//oo.isClient = true;
//oo.isServer = false;

describe("Embedded_Window", function () {
    var _this = this;

    var cls = cm.getClass("SalesOrderWindow");
    var wnd = null;
    it("Instantiate a window", _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
        return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        wnd = cls.new();

                    case 1:
                    case "end":
                        return _context.stop();
                }
            }
        }, _callee, _this);
    })));
    it("setRecord", _asyncToGenerator(regeneratorRuntime.mark(function _callee2() {
        var rec;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
            while (1) {
                switch (_context2.prev = _context2.next) {
                    case 0:
                        rec = wnd.getRecordClass().new();

                        wnd.setRecord(rec);
                        wnd.getRecord().should.be.equal(rec);

                    case 3:
                    case "end":
                        return _context2.stop();
                }
            }
        }, _callee2, _this);
    })));
    it("AfterEdit", _asyncToGenerator(regeneratorRuntime.mark(function _callee3() {
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
            while (1) {
                switch (_context3.prev = _context3.next) {
                    case 0:
                        _context3.next = 2;
                        return wnd.call_afterEdit('CustCode', 'C00001');

                    case 2:
                        'Cliente 1'.should.be.equal(wnd.getRecord().CustName);

                    case 3:
                    case "end":
                        return _context3.stop();
                }
            }
        }, _callee3, _this);
    })));
});

module.exports = function config(utilsModule) {
    utils = utilsModule;
};

//# sourceMappingURL=Embedded_WindowTest.js.map