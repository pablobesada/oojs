"use strict";
//var app = require("./../../app")

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

var chance = new require("chance")();
var _ = require("underscore");
var oo = require("openorange");
var query = oo.query;
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

    beforeEach(_asyncToGenerator(regeneratorRuntime.mark(function _callee() {
        return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        _context.next = 2;
                        return oo.beginTransaction();

                    case 2:
                    case "end":
                        return _context.stop();
                }
            }
        }, _callee, _this);
    })));
    after(_asyncToGenerator(regeneratorRuntime.mark(function _callee2() {
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
            while (1) {
                switch (_context2.prev = _context2.next) {
                    case 0:
                        _context2.next = 2;
                        return oo.commit();

                    case 2:
                    case "end":
                        return _context2.stop();
                }
            }
        }, _callee2, _this);
    })));

    /*
    it("create new record and set some field values", async () => {
        rec = cls.new();
        rec.String_Field = 'ABCD'
        let now = moment([2014,4-1,3]);
        rec.Date_Field = now
        should(rec.String_Field).be.equal('ABCD');
        should(rec.Date_Field.isSame(now)).ok()
    });
     it("Linkto fields must get its length from the linked record", async () => {
        rec = cls.new();
        let linkto_class = rec.fields("LinkTo_Field").getLinktoRecordClass()
        should(rec.fields("LinkTo_Field").getMaxLength()).be.equal(linkto_class.getDescription().fields[linkto_class.uniqueKey()[0]].length)
        should(rec.fields("String_Field").getMaxLength()).be.equal(cls.getDescription().fields.String_Field.length)
    });
     it("create new record and store it", async () => {
        rec = cls.new().fillWithRandomValues()
        let res = await rec.store();
        res.should.be.true();
        original_rec = rec.clone();
    })
     it("control for non-persistent fields", async () => {
        rec = cls.new().fillWithRandomValues()
        rec.NonPersistent_Field = "esto no deberia persistir"
        let row = rec.NonPersistent_Rows.newRow();
        cls.fillRecordWithRandomValues(row)
        rec.NonPersistent_Rows.push(row)
        let res = await rec.store();
        res.should.be.true();
        let loaded_rec = await cls.findOne({internalId: rec.internalId})
        should(loaded_rec.NonPersistent_Field).be.null();
        should(loaded_rec.Rows.length).be.greaterThan(0);
        should(loaded_rec.NonPersistent_Rows.length).be.equal(0);
    })
     it("load", async () => {
        rec = cls.new()
        rec.internalId = original_rec.internalId;
        rec.Date_Field = original_rec.Date_Field;
        console.log(original_rec.Date_Field)
        var res = await rec.load();
        res.should.be.true("no se grabo");
        original_rec.syncOldFields();
        rec.isEqual(original_rec).should.be.true("registros diferentes");
    })
     it("Concurrent store (storing with old syncVersion)", async () => {
        let r1 = await cls.newSavedRecord();
        let r2 = await cls.findOne({internalId: r1.internalId})
        should(r1.isEqual(r2)).be.true()
        r1.String_Field = 'r1'
        r1.Integer_Field++;
        should(await r1.store()).ok()
        r2.Integer_Field--;
        r2.String_Field = 'r2'
        should(await r2.store()).not.ok()
    })
     it("Detail integrity against master syncVersion", async () => {
        let r1 = await cls.newSavedRecord();
        let r2 = await cls.findOne({internalId: r1.internalId})
        should(r1.isEqual(r2)).be.true()
        console.log(r1)
        console.log(r1.Rows)
        console.log(r1.Rows.length)
        r1.Rows[0].Integer_Field++;
        should(await r1.store()).ok()
        r2.Rows[0].Integer_Field--;
        should(await r2.store()).not.ok()
     })
     it("Save new OK", async ()=> {
        rec = cls.new().fillWithRandomValues()
        should(await rec.save()).be.true("El save no grabo")
        should.exist(await cls.findOne({internalId: rec.internalId, Integer_Field: rec.Integer_Field}), "El save devolvio true, pero el registro no esta en la DB")
    })
     it("Save with Check fail", async ()=> {
         let internalId = rec.internalId;
        rec = await cls.findOne({internalId: rec.internalId})
        should.exist(rec);
        rec.checkReturnValue = false;
        rec.Integer_Field++;
        let res = await rec.save()
        res.should.be.false("El save grabo y no deberia haberse grabado")
        should.not.exist(await cls.findOne({internalId: rec.internalId, Integer_Field: rec.Integer_Field}), "El save devolvio false, pero igual grabo el registro")
    })
     it("Save with beforeInsert fail", async ()=> {
        let rec = cls.new().fillWithRandomValues()
        rec.beforeInsertReturnValue = false;
        for (let i=0;i<3;i++) {
            let record = cls.new().fillWithRandomValues()
            record.SubTestName = "Save with beforeInsert fail"
            rec.beforeInsert_recordsToStore.push(record);
        }
        rec.SubTestName = 'PARENT'
        let res = await rec.save()
        should(res).be.false("No deberia haber grabado")
        should.not.exist(await cls.findOne({String_Field: rec.String_Field}), "El save devolvio false, pero igual grabo el registro")
        for (let i in rec.beforeInsert_recordsToStore) {
            let record = rec.beforeInsert_recordsToStore[i]
            should.not.exist(await cls.findOne({internalId: record.internalId, String_Field: record.String_Field}), "El save devolvio false, pero igual grabo registros dentro del beforeInsert")
        }
    });
     it("Save with beforeUpdate fail", async ()=> {
        let rec = cls.new()
        utils.fillRecord(rec)
        rec.beforeUpdateReturnValue = false;
         let res = await rec.save()
        should(res).be.true("Deberia haber grabado");
        rec.Integer_Field++;
         res = await rec.save();
         should(res).be.false("No Deberia haber grabado");
        should.not.exist(await cls.findOne({internalId: rec.internalId, Integer_Field: rec.Integer_Field}), "El save devolvio false, pero igual grabo el registro")
    })
     it ("Check if it makes rollback when storing record with wrong fields", async () => {
        //cls.__description__.fields['DUMMY'] = {type: "string", length: 30}
        //cls.__description__.fieldnames.push("DUMMY")
        let rec = cls.new().fillWithRandomValues();
        rec.beforeInsertReturnValue = false;
        rec.SubTestName = 'TEST'
        for (let i=0;i<3;i++) {
            let record = cls2.new().fillWithRandomValues()
            record.SubTestName = rec.SubTestName
            rec.beforeInsert_recordsToStore.push(record);
        }
        let res = await rec.save();
    });
     it ("delete record", async () => {
        should(true).be.false()
    })
     it ("delete record check details and sets are gone", async () => {
        should(true).be.false()
    })
    */

    it("check sets behaviour", _asyncToGenerator(regeneratorRuntime.mark(function _callee3() {
        var res, setvalues, response, rset, i, _i;

        return regeneratorRuntime.wrap(function _callee3$(_context3) {
            while (1) {
                switch (_context3.prev = _context3.next) {
                    case 0:
                        rec = cls.new().fillWithRandomValues();
                        _context3.next = 3;
                        return rec.store();

                    case 3:
                        res = _context3.sent;

                        res.should.be.true();
                        setvalues = _(rec.Set_Field.split(",")).map(function (v) {
                            return v.trim();
                        });
                        _context3.next = 8;
                        return oo.getDBConnection();

                    case 8:
                        _context3.t0 = "SELECT Value FROM " + rec.fields('Set_Field').setrecordname + " WHERE masterId=?";
                        _context3.t1 = [rec.internalId];
                        _context3.next = 12;
                        return _context3.sent.query(_context3.t0, _context3.t1);

                    case 12:
                        response = _context3.sent;
                        rset = response[0];

                        should(rset.length).be.equal(setvalues.length);
                        for (i = 0; i < setvalues.length; i++) {
                            should(rset[i].Value).be.equal(setvalues[i]);
                        }
                        rec.Set_Field = chance.sentence({ words: 2 }).replace(/ /g, ",").replace(/\./g, "");
                        _context3.next = 19;
                        return rec.store();

                    case 19:
                        res = _context3.sent;

                        res.should.be.true();
                        setvalues = _(rec.Set_Field.split(",")).map(function (v) {
                            return v.trim();
                        });
                        _context3.next = 24;
                        return oo.getDBConnection();

                    case 24:
                        _context3.t2 = "SELECT Value FROM " + rec.fields('Set_Field').setrecordname + " WHERE masterId=?";
                        _context3.t3 = [rec.internalId];
                        _context3.next = 28;
                        return _context3.sent.query(_context3.t2, _context3.t3);

                    case 28:
                        response = _context3.sent;

                        rset = response[0];
                        should(rset.length).be.equal(setvalues.length);
                        for (_i = 0; _i < setvalues.length; _i++) {
                            should(rset[_i].Value).be.equal(setvalues[_i]);
                        }

                    case 32:
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