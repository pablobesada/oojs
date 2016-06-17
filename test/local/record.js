"use strict";
var app = require("./../../app")
var chance = new require("chance")()
var _ = require("underscore")
var oo = require("openorange")
var Query = oo.query;
var cm = oo.classmanager
var should = require('should');
var async = require('async')

describe("Record", function () {
    this.timeout(18000)
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

