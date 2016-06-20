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

    var cls = cm.getClass("TestRecord");
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
                        rec.isEqual(original_rec).should.be.true("registros diferentes");

                    case 8:
                    case "end":
                        return _context2.stop();
                }
            }
        }, _callee2, _this);
    })));

    it("Concurrent store (storing with old syncVersion)", _asyncToGenerator(regeneratorRuntime.mark(function _callee3() {
        var oldval, res, rec2;
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
            while (1) {
                switch (_context3.prev = _context3.next) {
                    case 0:
                        rec.syncOldFields();
                        rec.syncVersion -= 1;
                        rec.syncOldFields();
                        oldval = rec.Integer_Field++;
                        _context3.next = 6;
                        return rec.store();

                    case 6:
                        res = _context3.sent;

                        res.should.be.false("Se grabo cuando el store() deberia haber fallado por edicion concurrente");
                        rec2 = cls.new();

                        rec2.internalId = rec.internalId;
                        _context3.next = 12;
                        return rec2.load();

                    case 12:
                        rec2.Integer_Field.should.be.equal(oldval, "El campo se modifico en la base de datos");

                    case 13:
                    case "end":
                        return _context3.stop();
                }
            }
        }, _callee3, _this);
    })));

    it("Save OK", _asyncToGenerator(regeneratorRuntime.mark(function _callee4() {
        var internalId, res;
        return regeneratorRuntime.wrap(function _callee4$(_context4) {
            while (1) {
                switch (_context4.prev = _context4.next) {
                    case 0:
                        internalId = rec.internalId;

                        rec = cls.new();
                        rec.internalId = internalId;
                        _context4.next = 5;
                        return rec.load();

                    case 5:
                        res = _context4.sent;

                        res.should.be.true();
                        rec.checkReturnValue = true;
                        rec.Integer_Field++;
                        _context4.next = 11;
                        return rec.save();

                    case 11:
                        res = _context4.sent;

                        res.should.be.true("El save no grabo");
                        _context4.t0 = should;
                        _context4.next = 16;
                        return cls.findOne({ internalId: rec.internalId, Integer_Field: rec.Integer_Field });

                    case 16:
                        _context4.t1 = _context4.sent;

                        _context4.t0.exist.call(_context4.t0, _context4.t1, "El save devolvio true, pero el registro no esta en la DB");

                    case 18:
                    case "end":
                        return _context4.stop();
                }
            }
        }, _callee4, _this);
    })));

    it("Save with Check fail", _asyncToGenerator(regeneratorRuntime.mark(function _callee5() {
        var internalId, res;
        return regeneratorRuntime.wrap(function _callee5$(_context5) {
            while (1) {
                switch (_context5.prev = _context5.next) {
                    case 0:
                        internalId = rec.internalId;
                        _context5.next = 3;
                        return cls.findOne({ internalId: rec.internalId });

                    case 3:
                        rec = _context5.sent;

                        should.exist(rec);
                        rec.checkReturnValue = false;
                        rec.Integer_Field++;
                        _context5.next = 9;
                        return rec.save();

                    case 9:
                        res = _context5.sent;

                        res.should.be.false("El save grabo y no deberia haberse grabado");
                        _context5.t0 = should.not;
                        _context5.next = 14;
                        return cls.findOne({ internalId: rec.internalId, Integer_Field: rec.Integer_Field });

                    case 14:
                        _context5.t1 = _context5.sent;

                        _context5.t0.exist.call(_context5.t0, _context5.t1, "El save devolvio false, pero igual grabo el registro");

                    case 16:
                    case "end":
                        return _context5.stop();
                }
            }
        }, _callee5, _this);
    })));

    it("Save with beforeInsert fail", _asyncToGenerator(regeneratorRuntime.mark(function _callee6() {
        var rec, res;
        return regeneratorRuntime.wrap(function _callee6$(_context6) {
            while (1) {
                switch (_context6.prev = _context6.next) {
                    case 0:
                        rec = cls.new();

                        utils.fillRecord(rec);
                        rec.beforeInsertReturnValue = false;
                        _context6.next = 5;
                        return rec.save();

                    case 5:
                        res = _context6.sent;

                        should(res).be.false("No deberia haber grabado");
                        _context6.t0 = should.not;
                        _context6.next = 10;
                        return cls.findOne({ internalId: rec.internalId });

                    case 10:
                        _context6.t1 = _context6.sent;

                        _context6.t0.exist.call(_context6.t0, _context6.t1, "El save devolvio false, pero igual grabo el registro");

                    case 12:
                    case "end":
                        return _context6.stop();
                }
            }
        }, _callee6, _this);
    })));

    it("Save with beforeUpdate fail", _asyncToGenerator(regeneratorRuntime.mark(function _callee7() {
        var rec, res;
        return regeneratorRuntime.wrap(function _callee7$(_context7) {
            while (1) {
                switch (_context7.prev = _context7.next) {
                    case 0:
                        rec = cls.new();

                        utils.fillRecord(rec);
                        rec.beforeUpdateReturnValue = false;
                        _context7.next = 5;
                        return rec.save();

                    case 5:
                        res = _context7.sent;

                        should(res).be.true("Deberia haber grabado");
                        rec.Integer_Field++;
                        _context7.next = 10;
                        return rec.save();

                    case 10:
                        res = _context7.sent;

                        should(res).be.false("No Deberia haber grabado");
                        _context7.t0 = should.not;
                        _context7.next = 15;
                        return cls.findOne({ internalId: rec.internalId, Integer_Field: rec.Integer_Field });

                    case 15:
                        _context7.t1 = _context7.sent;

                        _context7.t0.exist.call(_context7.t0, _context7.t1, "El save devolvio false, pero igual grabo el registro");

                    case 17:
                    case "end":
                        return _context7.stop();
                }
            }
        }, _callee7, _this);
    })));
});

module.exports = function config(utilsModule) {
    utils = utilsModule;
};

//# sourceMappingURL=Embedded_RecordTest.js.map