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
    let cls = cm.getClass("TestRecordWindow");
    let wnd = null;
    it("Instantiate a window", async () => {
        wnd = cls.new()
    })
    it("setRecord", async () => {
        let rec = wnd.__class__.getRecordClass().new()
        wnd.setRecord(rec)
        wnd.getRecord().should.be.equal(rec)
    })
    it("AfterEdit", async () => {
        //let c = cm.getClass("SalesTransactionWindow").new()
        await wnd.call_afterEdit('LinkTo_Field', 'C00002')
        'Cliente 2'.should.be.equal(wnd.getRecord().String_Field)
    })
    it("Window receiving record events", async () => {
        wnd = cls.new()
        let rec1 = wnd.__class__.getRecordClass().new().fillWithRandomValues()
        wnd.setRecord(rec1)
        let rec2 = wnd.__class__.getRecordClass().new().fillWithRandomValues()
        let c1 = 0, c2 = false,c3=false,c4 =0;
        wnd.on('field modified', (event) => {
            c1++;
            should(event.record === rec2).true("wrong record received in field modified event: " + event.record)
        })
        wnd.on('record replaced', () => {
            c2 = true
        })
        wnd.on('detail cleared', () => {
            c3 = true
        })
        wnd.on('row inserted', () => {
            c4++
        })

        wnd.setRecord(rec2)
        rec2.String_Field = 'ABC'
        rec2.Rows.clear()
        rec2.Rows.push(rec2.Rows.newRow())
        rec2.Rows.insert(rec2.Rows.newRow(), 1)
        c1.should.be.equal(1, "field modified called wrong number of times");
        c2.should.be.true("record replaced never called");
        c3.should.be.true("detail cleared never called");
        c4.should.be.equal(2, "row inserted never called");

    })
    it("Apply Window Patch", async () => {
        //wnd = cm.getClass("TestRecordWindow")
        let wnd2 = cm.getClass("TestRecord2Window")
        //console.log(wnd.getDescription().form)
        console.log(wnd2.getDescription().form)
    })
});

