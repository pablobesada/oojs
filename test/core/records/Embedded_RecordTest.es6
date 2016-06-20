"use strict";
//var app = require("./../../app")
var chance = new require("chance")()
var _ = require("underscore")
var oo = require("openorange")
var Query = oo.query;
var cm = oo.classmanager
var should = require('should');
var async = require('async')
let utils = null;

describe("Embedded_Record", function () {
    let cls = cm.getClass("TestRecord");
    let rec = null;
    let original_rec = null;
    it("create new record and store it", async () => {
        rec = cls.new()
        utils.fillRecord(rec);
        let res = await rec.store();
        res.should.be.true();
        original_rec = rec.clone();
    })

    it("load", async () => {
        rec = cls.new()
        rec.internalId = original_rec.internalId;
        var res = await rec.load();
        res.should.be.true("no se grabo");
        original_rec.syncOldFields();
        rec.isEqual(original_rec).should.be.true("registros diferentes");
    })

    it("Concurrent store (storing with old syncVersion)", async () => {
        rec.syncOldFields()
        rec.syncVersion -= 1
        rec.syncOldFields();
        let oldval = rec.Integer_Field++;
        let res = await rec.store()
        res.should.be.false("Se grabo cuando el store() deberia haber fallado por edicion concurrente");
        let rec2 = cls.new()
        rec2.internalId = rec.internalId;
        await rec2.load();
        rec2.Integer_Field.should.be.equal(oldval, "El campo se modifico en la base de datos")
    })

    it("Save OK", async ()=> {
        let internalId = rec.internalId;
        rec = cls.new()
        rec.internalId = internalId;
        let res = await rec.load();
        res.should.be.true();
        rec.checkReturnValue = true;
        rec.Integer_Field++;
        res = await rec.save()
        res.should.be.true("El save no grabo")
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
        let res = await rec.save()
        should(res).be.false("No deberia haber grabado")
        should.not.exist(await cls.findOne({internalId: rec.internalId}), "El save devolvio false, pero igual grabo el registro")
    })

    it("Save with beforeUpdate fail", async ()=> {
        let rec = cls.new()
        utils.fillRecord(rec)
        rec.beforeUpdateReturnValue = false;
        let res = await rec.save()
        should(res).be.true("Deberia haber grabado")
        rec.Integer_Field++;
        res = await rec.save()
        should(res).be.false("No Deberia haber grabado")
        should.not.exist(await cls.findOne({internalId: rec.internalId, Integer_Field: rec.Integer_Field}), "El save devolvio false, pero igual grabo el registro")
    })
});

module.exports = function config(utilsModule) {
    utils = utilsModule
}