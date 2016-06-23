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
    var cls2 = cm.getClass("TestRecord2");
    var rec = null;
    var original_rec = null;

    it("create new record and store it", _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
        var res;
        return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        return _context.abrupt("return");

                    case 3:
                        _context.next = 5;
                        return _context.sent.beginTransaction();

                    case 5:
                        rec = cls.new();
                        utils.fillRecord(rec);
                        _context.next = 9;
                        return rec.store();

                    case 9:
                        res = _context.sent;

                        res.should.be.true();
                        original_rec = rec.clone();
                        _context.next = 14;
                        return oo.contextmanager.getDBConnection();

                    case 14:
                        _context.next = 16;
                        return _context.sent.commit();

                    case 16:
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
                        return _context2.abrupt("return");

                    case 5:
                        res = _context2.sent;

                        res.should.be.true("no se grabo");
                        original_rec.syncOldFields();
                        rec.isEqual(original_rec).should.be.true("registros diferentes");

                    case 9:
                    case "end":
                        return _context2.stop();
                }
            }
        }, _callee2, _this);
    })));

    it("Concurrent store (storing with old syncVersion)", _asyncToGenerator(regeneratorRuntime.mark(function _callee3() {
        var r1, r2;
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
            while (1) {
                switch (_context3.prev = _context3.next) {
                    case 0:
                        return _context3.abrupt("return");

                    case 3:
                        _context3.next = 5;
                        return _context3.sent.beginTransaction();

                    case 5:
                        _context3.next = 7;
                        return cls.newSavedRecord();

                    case 7:
                        r1 = _context3.sent;
                        _context3.next = 10;
                        return cls.findOne({ internalId: r1.internalId });

                    case 10:
                        r2 = _context3.sent;

                        should(r1.isEqual(r2)).be.true();
                        r1.String_Field = 'r1';
                        r1.Integer_Field++;
                        _context3.next = 16;
                        return r1.store();

                    case 16:
                        _context3.t0 = _context3.sent;
                        should(_context3.t0).ok();

                        r2.Integer_Field--;
                        r2.String_Field = 'r2';
                        _context3.next = 22;
                        return r2.store();

                    case 22:
                        _context3.t1 = _context3.sent;
                        should(_context3.t1).not.ok();

                    case 24:
                    case "end":
                        return _context3.stop();
                }
            }
        }, _callee3, _this);
    })));

    //await (await oo.contextmanager.getDBConnection()).commit()
    it("Detail integrity against master syncVersion", _asyncToGenerator(regeneratorRuntime.mark(function _callee4() {
        var r1, r2;
        return regeneratorRuntime.wrap(function _callee4$(_context4) {
            while (1) {
                switch (_context4.prev = _context4.next) {
                    case 0:
                        return _context4.abrupt("return");

                    case 3:
                        r1 = _context4.sent;
                        _context4.next = 6;
                        return cls.findOne({ internalId: r1.internalId });

                    case 6:
                        r2 = _context4.sent;

                        should(r1.isEqual(r2)).be.true();
                        r1.Rows[0].Integer_Field++;
                        _context4.next = 11;
                        return r1.store();

                    case 11:
                        _context4.t0 = _context4.sent;
                        should(_context4.t0).ok();

                        r2.Rows[0].Integer_Field--;
                        _context4.next = 16;
                        return r2.store();

                    case 16:
                        _context4.t1 = _context4.sent;
                        should(_context4.t1).not.ok();

                    case 18:
                    case "end":
                        return _context4.stop();
                }
            }
        }, _callee4, _this);
    })));

    it("Save new OK", _asyncToGenerator(regeneratorRuntime.mark(function _callee5() {
        return regeneratorRuntime.wrap(function _callee5$(_context5) {
            while (1) {
                switch (_context5.prev = _context5.next) {
                    case 0:
                        return _context5.abrupt("return");

                    case 5:
                        _context5.t0 = _context5.sent;
                        should(_context5.t0).be.true("El save no grabo");
                        _context5.t1 = should;
                        _context5.next = 10;
                        return cls.findOne({ internalId: rec.internalId, Integer_Field: rec.Integer_Field });

                    case 10:
                        _context5.t2 = _context5.sent;

                        _context5.t1.exist.call(_context5.t1, _context5.t2, "El save devolvio true, pero el registro no esta en la DB");

                    case 12:
                    case "end":
                        return _context5.stop();
                }
            }
        }, _callee5, _this);
    })));

    it("Save with Check fail", _asyncToGenerator(regeneratorRuntime.mark(function _callee6() {
        var internalId, res;
        return regeneratorRuntime.wrap(function _callee6$(_context6) {
            while (1) {
                switch (_context6.prev = _context6.next) {
                    case 0:
                        return _context6.abrupt("return");

                    case 4:
                        rec = _context6.sent;

                        should.exist(rec);
                        rec.checkReturnValue = false;
                        rec.Integer_Field++;
                        _context6.next = 10;
                        return rec.save();

                    case 10:
                        res = _context6.sent;

                        res.should.be.false("El save grabo y no deberia haberse grabado");
                        _context6.t0 = should.not;
                        _context6.next = 15;
                        return cls.findOne({ internalId: rec.internalId, Integer_Field: rec.Integer_Field });

                    case 15:
                        _context6.t1 = _context6.sent;

                        _context6.t0.exist.call(_context6.t0, _context6.t1, "El save devolvio false, pero igual grabo el registro");

                    case 17:
                    case "end":
                        return _context6.stop();
                }
            }
        }, _callee6, _this);
    })));

    it("Save with beforeInsert fail", _asyncToGenerator(regeneratorRuntime.mark(function _callee7() {
        var rec, i, record, res, _i, _record;

        return regeneratorRuntime.wrap(function _callee7$(_context7) {
            while (1) {
                switch (_context7.prev = _context7.next) {
                    case 0:
                        return _context7.abrupt("return");

                    case 8:
                        res = _context7.sent;

                        should(res).be.false("No deberia haber grabado");
                        _context7.t0 = should.not;
                        _context7.next = 13;
                        return cls.findOne({ internalId: rec.internalId });

                    case 13:
                        _context7.t1 = _context7.sent;

                        _context7.t0.exist.call(_context7.t0, _context7.t1, "El save devolvio false, pero igual grabo el registro");

                        _context7.t2 = regeneratorRuntime.keys(rec.beforeInsert_recordsToStore);

                    case 16:
                        if ((_context7.t3 = _context7.t2()).done) {
                            _context7.next = 26;
                            break;
                        }

                        _i = _context7.t3.value;
                        _record = rec.beforeInsert_recordsToStore[_i];
                        _context7.t4 = should.not;
                        _context7.next = 22;
                        return cls.findOne({ internalId: _record.internalId, String_Field: _record.String_Field });

                    case 22:
                        _context7.t5 = _context7.sent;

                        _context7.t4.exist.call(_context7.t4, _context7.t5, "El save devolvio false, pero igual grabo registros dentro del beforeInsert");

                        _context7.next = 16;
                        break;

                    case 26:
                    case "end":
                        return _context7.stop();
                }
            }
        }, _callee7, _this);
    })));

    it("Save with beforeUpdate fail", _asyncToGenerator(regeneratorRuntime.mark(function _callee8() {
        var rec, res;
        return regeneratorRuntime.wrap(function _callee8$(_context8) {
            while (1) {
                switch (_context8.prev = _context8.next) {
                    case 0:
                        return _context8.abrupt("return");

                    case 6:
                        res = _context8.sent;

                        should(res).be.true("Deberia haber grabado");
                        rec.Integer_Field++;
                        _context8.next = 11;
                        return rec.save();

                    case 11:
                        res = _context8.sent;

                        should(res).be.false("No Deberia haber grabado");
                        _context8.t0 = should.not;
                        _context8.next = 16;
                        return cls.findOne({ internalId: rec.internalId, Integer_Field: rec.Integer_Field });

                    case 16:
                        _context8.t1 = _context8.sent;

                        _context8.t0.exist.call(_context8.t0, _context8.t1, "El save devolvio false, pero igual grabo el registro");

                    case 18:
                    case "end":
                        return _context8.stop();
                }
            }
        }, _callee8, _this);
    })));

    it("Check if it makes rollback when storing record with wrong fields", _asyncToGenerator(regeneratorRuntime.mark(function _callee9() {
        var rec, i, record, res;
        return regeneratorRuntime.wrap(function _callee9$(_context9) {
            while (1) {
                switch (_context9.prev = _context9.next) {
                    case 0:
                        _context9.next = 2;
                        return oo.beginTransaction();

                    case 2:
                        //cls.__description__.fields['DUMMY'] = {type: "string", length: 30}
                        //cls.__description__.fieldnames.push("DUMMY")
                        rec = cls.new().fillWithRandomValues();

                        rec.beforeInsertReturnValue = false;
                        rec.SubTestName = 'TEST';
                        for (i = 0; i < 3; i++) {
                            record = cls2.new().fillWithRandomValues();

                            record.SubTestName = rec.SubTestName;
                            rec.beforeInsert_recordsToStore.push(record);
                        }

                        _context9.next = 8;
                        return rec.save();

                    case 8:
                        res = _context9.sent;
                        _context9.next = 11;
                        return oo.commit();

                    case 11:
                    case "end":
                        return _context9.stop();
                }
            }
        }, _callee9, _this);
    })));
});

module.exports = function config(utilsModule) {
    utils = utilsModule;
};

//# sourceMappingURL=Embedded_RecordTest.js.map