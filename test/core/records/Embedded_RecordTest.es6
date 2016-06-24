"use strict";
//var app = require("./../../app")
var chance = new require("chance")();
var _ = require("underscore")
var oo = require("openorange")
var Query = oo.query;
var cm = oo.classmanager
var should = require('should');
var async = require('async')
var moment = require('moment')
let utils = null;

describe("Embedded_Record", function () {
    let cls = cm.getClass("TestRecord");
    let cls2 = cm.getClass("TestRecord2");
    let rec = null;
    let original_rec = null;

    it("create new record and set some field values", async () => {
        rec = cls.new();
        rec.String_Field = 'ABCD'
        let now = moment();
        rec.Date_Field = now
        should(rec.String_Field).be.equal('ABCD');
        should(rec.Date_Field).be.equal(now);
    });

    it("create new record and store it", async () => {
        await (await oo.contextmanager.getDBConnection()).beginTransaction()
        rec = cls.new().fillWithRandomValues()
        let res = await rec.store();
        res.should.be.true();
        original_rec = rec.clone();
        await (await oo.contextmanager.getDBConnection()).commit()
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
        await (await oo.contextmanager.getDBConnection()).beginTransaction()
        let r1 = await cls.newSavedRecord();
        let r2 = await cls.findOne({internalId: r1.internalId})
        should(r1.isEqual(r2)).be.true()
        r1.String_Field = 'r1'
        r1.Integer_Field++;
        should(await r1.store()).ok()
        r2.Integer_Field--;
        r2.String_Field = 'r2'
        should(await r2.store()).not.ok()
        //await (await oo.contextmanager.getDBConnection()).commit()
    })

    it("Detail integrity against master syncVersion", async () => {
        let r1 = await cls.newSavedRecord();
        let r2 = await cls.findOne({internalId: r1.internalId})
        should(r1.isEqual(r2)).be.true()
        r1.Rows[0].Integer_Field++;
        should(await r1.store()).ok()
        r2.Rows[0].Integer_Field--;
        should(await r2.store()).not.ok()

    })

    it("Save new OK", async ()=> {
        rec = cls.new()
        utils.fillRecord(rec);
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
        let rec = cls.new()
        utils.fillRecord(rec)
        rec.beforeInsertReturnValue = false;
        for (let i=0;i<3;i++) {
            let record = cls.new().fillWithRandomValues()
            record.SubTestName = "Save with beforeInsert fail"
            rec.beforeInsert_recordsToStore.push(record);
        }
        rec.SubTestName = 'PARENT'
        let res = await rec.save()
        should(res).be.false("No deberia haber grabado")
        should.not.exist(await cls.findOne({internalId: rec.internalId}), "El save devolvio false, pero igual grabo el registro")
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
        await oo.beginTransaction()
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
        await oo.commit()
    });
});

module.exports = function config(utilsModule) {
    utils = utilsModule
};