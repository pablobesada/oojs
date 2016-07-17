"use strict";
var app = require("./../../../../app")
var chance = new require("chance")()
var _ = require("underscore")
var oo = require("openorange")
let cm = oo.classmanager
var Query = oo.query;
var should = require('should');
var async = require('async')


describe('Cards', function () {
    it('Provider', async () => {
        let C = cm.getClass("Embedded_Card")
        let cls = cm.getClass("TestRecordWindow");
        console.log(cls.getProvidedDataTypes())
        let rec = await cls.getRecordClass().new();
        let w = new  cls()
        w.setRecord(rec)
        //console.log(await w.getProvidedData())
        let mcs = C.findMatchingCards(cls.getProvidedDataTypes())
        _(mcs).each((c) => {console.log(c.getDescription().name, c.getDescription().params)})

    })

    it('Source Provider', async () => {
        let TestRecordWindow = cm.getClass("TestRecordWindow")
        let w = TestRecordWindow.new();
        let r = w.__class__.getRecordClass().new()
        w.setRecord(r)
        r.LinkTo_Field = 'C00002'
        console.log("RLF", r['Linkto_Field'])

        let dp = w.getProvidedData();
        //console.log(dp)
        console.log(await dp.getData('__record__'))
        console.log(await dp.getData('LinkTo_Field'))

        //console.log(dp)
        dp.on('changed', async (event) => {
            console.log("DP Changed", event)
            console.log(await dp.getData('LinkTo_Field'))
        })
        r.LinkTo_Field = 'C00003'
        //w.setRecord(w.__class__.getRecordClass().new())

    })
});