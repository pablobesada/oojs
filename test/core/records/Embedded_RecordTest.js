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

describe("Embedded_Record", function () {
    var _this = this;

    this.timeout(18000);
    var cls = cm.getClass("SalesOrder");
    var rec = null;
    var original_rec = null;
    it("create new record and store it", _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
        var res;
        return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        rec = cls.new();
                        utils.fillRecord(rec);
                        _context.next = 4;
                        return rec.store();

                    case 4:
                        res = _context.sent;

                        res.should.be.true();
                        original_rec = rec.clone();

                    case 7:
                    case "end":
                        return _context.stop();
                }
            }
        }, _callee, _this);
    })));

    it("load", _asyncToGenerator(regeneratorRuntime.mark(function _callee2() {
        var res;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
            while (1) {
                switch (_context2.prev = _context2.next) {
                    case 0:
                        rec = cls.new();
                        rec.internalId = original_rec.internalId;
                        _context2.next = 4;
                        return rec.load();

                    case 4:
                        res = _context2.sent;

                        res.should.be.true("no se grabo");
                        original_rec.syncOldFields();
                        //console.log(JSON.stringify(rec.toJSON()))
                        //console.log(JSON.stringify(original_rec.toJSON()))
                        rec.isEqual(original_rec).should.be.true("registros diferentes");

                    case 8:
                    case "end":
                        return _context2.stop();
                }
            }
        }, _callee2, _this);
    })));

    it("Concurrent save (saving with old syncVersion)", _asyncToGenerator(regeneratorRuntime.mark(function _callee3() {
        var sonr, SalesOrder, so, original_custname, res, so2;
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
            while (1) {
                switch (_context3.prev = _context3.next) {
                    case 0:
                        sonr = 2222444;
                        SalesOrder = cm.getClass("SalesOrder");
                        _context3.next = 4;
                        return SalesOrder.bring(sonr);

                    case 4:
                        so = _context3.sent;

                        so.syncVersion -= 1;
                        so.syncOldFields();
                        original_custname = so.CustName;

                        so.CustName += 'ABC';
                        _context3.next = 11;
                        return so.save();

                    case 11:
                        res = _context3.sent;

                        res.should.be.false();
                        so2 = SalesOrder.new();

                        so2.SerNr = sonr;
                        _context3.next = 17;
                        return so2.load();

                    case 17:
                        so2.CustName.should.be.equal(original_custname);

                    case 18:
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

//# sourceMappingURL=Embedded_RecordTest.js.map