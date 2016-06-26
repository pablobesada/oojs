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
var moment = require('moment');
var utils = null;

describe("Embedded_Record", function () {
    var _this = this;

    var cls = cm.getClass("TestRecord");
    var cls2 = cm.getClass("TestRecord2");
    var rec = null;
    var original_rec = null;

    it("create new record and set some field values", _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
        var now;
        return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        rec = cls.new();
                        rec.String_Field = 'ABCD';
                        now = moment([2014, 4 - 1, 3]);

                        rec.Date_Field = now;
                        should(rec.String_Field).be.equal('ABCD');
                        should(rec.Date_Field.isSame(now)).ok();

                    case 6:
                    case "end":
                        return _context.stop();
                }
            }
        }, _callee, _this);
    })));

    it("Linkto fields must get its length from the linked record", _asyncToGenerator(regeneratorRuntime.mark(function _callee2() {
        var linkto_class;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
            while (1) {
                switch (_context2.prev = _context2.next) {
                    case 0:
                        rec = cls.new();
                        linkto_class = rec.fields("LinkTo_Field").getLinktoRecordClass();

                        should(rec.fields("LinkTo_Field").getMaxLength()).be.equal(linkto_class.getDescription().fields[linkto_class.uniqueKey()[0]].length);
                        should(rec.fields("String_Field").getMaxLength()).be.equal(cls.getDescription().fields.String_Field.length);

                    case 4:
                    case "end":
                        return _context2.stop();
                }
            }
        }, _callee2, _this);
    })));

    it("create new record and store it", _asyncToGenerator(regeneratorRuntime.mark(function _callee3() {
        var res;
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
            while (1) {
                switch (_context3.prev = _context3.next) {
                    case 0:
                        _context3.next = 2;
                        return oo.beginTransaction();

                    case 2:
                        rec = cls.new().fillWithRandomValues();
                        _context3.next = 5;
                        return rec.store();

                    case 5:
                        res = _context3.sent;

                        res.should.be.true();
                        original_rec = rec.clone();
                        _context3.next = 10;
                        return oo.commit();

                    case 10:
                    case "end":
                        return _context3.stop();
                }
            }
        }, _callee3, _this);
    })));

    it("control for non-persistent fields", _asyncToGenerator(regeneratorRuntime.mark(function _callee4() {
        var row, res, loaded_rec;
        return regeneratorRuntime.wrap(function _callee4$(_context4) {
            while (1) {
                switch (_context4.prev = _context4.next) {
                    case 0:
                        _context4.next = 2;
                        return oo.beginTransaction();

                    case 2:
                        rec = cls.new().fillWithRandomValues();
                        rec.NonPersistent_Field = "esto no deberia persistir";
                        row = rec.NonPersistent_Rows.newRow();

                        cls.fillRecordWithRandomValues(row);
                        rec.NonPersistent_Rows.push(row);
                        _context4.next = 9;
                        return rec.store();

                    case 9:
                        res = _context4.sent;

                        res.should.be.true();
                        _context4.next = 13;
                        return cls.findOne({ internalId: rec.internalId });

                    case 13:
                        loaded_rec = _context4.sent;

                        should(loaded_rec.NonPersistent_Field).be.null();
                        should(loaded_rec.Rows.length).be.greaterThan(0);
                        should(loaded_rec.NonPersistent_Rows.length).be.equal(0);
                        _context4.next = 19;
                        return oo.commit();

                    case 19:
                    case "end":
                        return _context4.stop();
                }
            }
        }, _callee4, _this);
    })));

    it("load", _asyncToGenerator(regeneratorRuntime.mark(function _callee5() {
        var res;
        return regeneratorRuntime.wrap(function _callee5$(_context5) {
            while (1) {
                switch (_context5.prev = _context5.next) {
                    case 0:
                        rec = cls.new();
                        rec.internalId = original_rec.internalId;
                        rec.Date_Field = original_rec.Date_Field;
                        console.log(original_rec.Date_Field);
                        _context5.next = 6;
                        return rec.load();

                    case 6:
                        res = _context5.sent;

                        res.should.be.true("no se grabo");
                        original_rec.syncOldFields();
                        rec.isEqual(original_rec).should.be.true("registros diferentes");

                    case 10:
                    case "end":
                        return _context5.stop();
                }
            }
        }, _callee5, _this);
    })));

    it("Concurrent store (storing with old syncVersion)", _asyncToGenerator(regeneratorRuntime.mark(function _callee6() {
        var r1, r2;
        return regeneratorRuntime.wrap(function _callee6$(_context6) {
            while (1) {
                switch (_context6.prev = _context6.next) {
                    case 0:
                        _context6.next = 2;
                        return oo.contextmanager.getDBConnection();

                    case 2:
                        _context6.next = 4;
                        return _context6.sent.beginTransaction();

                    case 4:
                        _context6.next = 6;
                        return cls.newSavedRecord();

                    case 6:
                        r1 = _context6.sent;
                        _context6.next = 9;
                        return cls.findOne({ internalId: r1.internalId });

                    case 9:
                        r2 = _context6.sent;

                        should(r1.isEqual(r2)).be.true();
                        r1.String_Field = 'r1';
                        r1.Integer_Field++;
                        _context6.next = 15;
                        return r1.store();

                    case 15:
                        _context6.t0 = _context6.sent;
                        should(_context6.t0).ok();

                        r2.Integer_Field--;
                        r2.String_Field = 'r2';
                        _context6.next = 21;
                        return r2.store();

                    case 21:
                        _context6.t1 = _context6.sent;
                        should(_context6.t1).not.ok();

                    case 23:
                    case "end":
                        return _context6.stop();
                }
            }
        }, _callee6, _this);
    })));

    //await (await oo.contextmanager.getDBConnection()).commit()
    it("Detail integrity against master syncVersion", _asyncToGenerator(regeneratorRuntime.mark(function _callee7() {
        var r1, r2;
        return regeneratorRuntime.wrap(function _callee7$(_context7) {
            while (1) {
                switch (_context7.prev = _context7.next) {
                    case 0:
                        _context7.next = 2;
                        return cls.newSavedRecord();

                    case 2:
                        r1 = _context7.sent;
                        _context7.next = 5;
                        return cls.findOne({ internalId: r1.internalId });

                    case 5:
                        r2 = _context7.sent;

                        should(r1.isEqual(r2)).be.true();
                        console.log(r1);
                        console.log(r1.Rows);
                        console.log(r1.Rows.length);
                        r1.Rows[0].Integer_Field++;
                        _context7.next = 13;
                        return r1.store();

                    case 13:
                        _context7.t0 = _context7.sent;
                        should(_context7.t0).ok();

                        r2.Rows[0].Integer_Field--;
                        _context7.next = 18;
                        return r2.store();

                    case 18:
                        _context7.t1 = _context7.sent;
                        should(_context7.t1).not.ok();

                    case 20:
                    case "end":
                        return _context7.stop();
                }
            }
        }, _callee7, _this);
    })));

    it("Save new OK", _asyncToGenerator(regeneratorRuntime.mark(function _callee8() {
        return regeneratorRuntime.wrap(function _callee8$(_context8) {
            while (1) {
                switch (_context8.prev = _context8.next) {
                    case 0:
                        rec = cls.new().fillWithRandomValues();
                        _context8.next = 3;
                        return rec.save();

                    case 3:
                        _context8.t0 = _context8.sent;
                        should(_context8.t0).be.true("El save no grabo");
                        _context8.t1 = should;
                        _context8.next = 8;
                        return cls.findOne({ internalId: rec.internalId, Integer_Field: rec.Integer_Field });

                    case 8:
                        _context8.t2 = _context8.sent;

                        _context8.t1.exist.call(_context8.t1, _context8.t2, "El save devolvio true, pero el registro no esta en la DB");

                    case 10:
                    case "end":
                        return _context8.stop();
                }
            }
        }, _callee8, _this);
    })));

    it("Save with Check fail", _asyncToGenerator(regeneratorRuntime.mark(function _callee9() {
        var internalId, res;
        return regeneratorRuntime.wrap(function _callee9$(_context9) {
            while (1) {
                switch (_context9.prev = _context9.next) {
                    case 0:
                        internalId = rec.internalId;
                        _context9.next = 3;
                        return cls.findOne({ internalId: rec.internalId });

                    case 3:
                        rec = _context9.sent;

                        should.exist(rec);
                        rec.checkReturnValue = false;
                        rec.Integer_Field++;
                        _context9.next = 9;
                        return rec.save();

                    case 9:
                        res = _context9.sent;

                        res.should.be.false("El save grabo y no deberia haberse grabado");
                        _context9.t0 = should.not;
                        _context9.next = 14;
                        return cls.findOne({ internalId: rec.internalId, Integer_Field: rec.Integer_Field });

                    case 14:
                        _context9.t1 = _context9.sent;

                        _context9.t0.exist.call(_context9.t0, _context9.t1, "El save devolvio false, pero igual grabo el registro");

                    case 16:
                    case "end":
                        return _context9.stop();
                }
            }
        }, _callee9, _this);
    })));

    it("Save with beforeInsert fail", _asyncToGenerator(regeneratorRuntime.mark(function _callee10() {
        var rec, i, record, res, _i, _record;

        return regeneratorRuntime.wrap(function _callee10$(_context10) {
            while (1) {
                switch (_context10.prev = _context10.next) {
                    case 0:
                        rec = cls.new().fillWithRandomValues();

                        rec.beforeInsertReturnValue = false;
                        for (i = 0; i < 3; i++) {
                            record = cls.new().fillWithRandomValues();

                            record.SubTestName = "Save with beforeInsert fail";
                            rec.beforeInsert_recordsToStore.push(record);
                        }
                        rec.SubTestName = 'PARENT';
                        _context10.next = 6;
                        return rec.save();

                    case 6:
                        res = _context10.sent;

                        should(res).be.false("No deberia haber grabado");
                        _context10.t0 = should.not;
                        _context10.next = 11;
                        return cls.findOne({ String_Field: rec.String_Field });

                    case 11:
                        _context10.t1 = _context10.sent;

                        _context10.t0.exist.call(_context10.t0, _context10.t1, "El save devolvio false, pero igual grabo el registro");

                        _context10.t2 = regeneratorRuntime.keys(rec.beforeInsert_recordsToStore);

                    case 14:
                        if ((_context10.t3 = _context10.t2()).done) {
                            _context10.next = 24;
                            break;
                        }

                        _i = _context10.t3.value;
                        _record = rec.beforeInsert_recordsToStore[_i];
                        _context10.t4 = should.not;
                        _context10.next = 20;
                        return cls.findOne({ internalId: _record.internalId, String_Field: _record.String_Field });

                    case 20:
                        _context10.t5 = _context10.sent;

                        _context10.t4.exist.call(_context10.t4, _context10.t5, "El save devolvio false, pero igual grabo registros dentro del beforeInsert");

                        _context10.next = 14;
                        break;

                    case 24:
                    case "end":
                        return _context10.stop();
                }
            }
        }, _callee10, _this);
    })));

    it("Save with beforeUpdate fail", _asyncToGenerator(regeneratorRuntime.mark(function _callee11() {
        var rec, res;
        return regeneratorRuntime.wrap(function _callee11$(_context11) {
            while (1) {
                switch (_context11.prev = _context11.next) {
                    case 0:
                        rec = cls.new();

                        utils.fillRecord(rec);
                        rec.beforeUpdateReturnValue = false;
                        _context11.next = 5;
                        return rec.save();

                    case 5:
                        res = _context11.sent;

                        should(res).be.true("Deberia haber grabado");
                        rec.Integer_Field++;
                        _context11.next = 10;
                        return rec.save();

                    case 10:
                        res = _context11.sent;

                        should(res).be.false("No Deberia haber grabado");
                        _context11.t0 = should.not;
                        _context11.next = 15;
                        return cls.findOne({ internalId: rec.internalId, Integer_Field: rec.Integer_Field });

                    case 15:
                        _context11.t1 = _context11.sent;

                        _context11.t0.exist.call(_context11.t0, _context11.t1, "El save devolvio false, pero igual grabo el registro");

                    case 17:
                    case "end":
                        return _context11.stop();
                }
            }
        }, _callee11, _this);
    })));

    it("Check if it makes rollback when storing record with wrong fields", _asyncToGenerator(regeneratorRuntime.mark(function _callee12() {
        var rec, i, record, res;
        return regeneratorRuntime.wrap(function _callee12$(_context12) {
            while (1) {
                switch (_context12.prev = _context12.next) {
                    case 0:
                        _context12.next = 2;
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

                        _context12.next = 8;
                        return rec.save();

                    case 8:
                        res = _context12.sent;
                        _context12.next = 11;
                        return oo.commit();

                    case 11:
                    case "end":
                        return _context12.stop();
                }
            }
        }, _callee12, _this);
    })));
});

module.exports = function config(utilsModule) {
    utils = utilsModule;
};

//# sourceMappingURL=Embedded_RecordTest.js.map