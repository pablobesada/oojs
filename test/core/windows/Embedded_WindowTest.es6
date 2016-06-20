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
//oo.isClient = true;
//oo.isServer = false;

describe("Embedded_Window", function () {
    let cls = cm.getClass("SalesOrderWindow");
    let wnd = null;
    it("Instantiate a window", async () => {
        wnd = cls.new()
    })
    it("setRecord", async () => {
        let rec = wnd.getRecordClass().new()
        wnd.setRecord(rec)
        wnd.getRecord().should.be.equal(rec)
    })
    it("AfterEdit", async () => {
        //let c = cm.getClass("SalesTransactionWindow").new()
        await wnd.call_afterEdit('CustCode', 'C00001')
        'Cliente 1'.should.be.equal(wnd.getRecord().CustName)
    })
});

module.exports = function config(utilsModule) {
    utils = utilsModule
}