"use strict";
var app = require("./../../app")
var chance = new require("chance")()
var _ = require("underscore")
var oo = require("openorange")
var Query = oo.query;
var cm = oo.classmanager
var should = require('should');
var async = require('async')
var utils = require("../utils")

describe("Record", function () {
    this.timeout(18000)
    let cls = cm.getClass("SalesOrder");
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
        //console.log(JSON.stringify(rec.toJSON()))
        //console.log(JSON.stringify(original_rec.toJSON()))
        rec.isEqual(original_rec).should.be.true("registros diferentes");
    })

    it("Concurrent save (saving with old syncVersion)", async () => {
        let sonr = 2222444;
        let SalesOrder = cm.getClass("SalesOrder");
        let so = await SalesOrder.bring(sonr)
        so.syncVersion -= 1
        so.syncOldFields();
        let original_custname = so.CustName;
        so.CustName += 'ABC';
        let res = await so.save()
        res.should.be.false();
        let so2 = SalesOrder.new()
        so2.SerNr = sonr;
        await so2.load();
        so2.CustName.should.be.equal(original_custname)
    })
});

