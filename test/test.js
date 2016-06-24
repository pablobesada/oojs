"use strict";
//require('babel-register')({
//    ignore: /node_modules\/(?!openorange)/
//});
require("babel-polyfill");

var app = require("./../app")
require.prototype.main = app.module
//var oo = require("./../openorange")
var oo = require("openorange")
var Query = oo.query;
//console.log(oo.isClient)
var cm = oo.classmanager
var should = require('should');
var async = require('async')
var utils = require("./utils")


//cm.addScriptDir("test")

require("./core/records/Embedded_RecordTest")(utils)
//require("./core/windows/Embedded_WindowTest")(utils)
//require("./local/ReportTest.js")
//require("./tools/ormTest")





/*
describe("Record", function () {
    before(function (done) {
        var SalesOrder = cm.getClass("SalesOrder");
        var so = SalesOrder.new()
        so.SerNr = 6669
        so.load()
            .then(function () {
                //console.log("is new: " + so.isNew())
            })
            .then(function () {
                so.delete()
            })
            .then(done)
    })

    it("It should clone a record", function (done) {
        var SalesOrder = cm.getClass("SalesOrder");
        var so = SalesOrder.new()
        fillRecord(so);
        var newso = so.clone()
        newso.isEqual(so).should.be.true()
        done()

    });

    it("It should convert a record to JSON and back", function (done) {
        var SalesOrder = cm.getClass("SalesOrder");
        var so = SalesOrder.new()
        fillRecord(so);
        so.Items.splice(2,2)
        var convertedso = cm.getClass("Record").fromJSON(so.toJSON())
        convertedso.isEqual(so).should.be.true()
        done()

    });
    it("It should create a Record", function (done) {
        var SalesOrder = cm.getClass("SalesOrder");
        var so = SalesOrder.new()
        so.SerNr = 333
        done()
    });

    it("It should save a SalesOrder", function (done) {
        var SalesOrder = cm.getClass("SalesOrder");
        var so = SalesOrder.new()
        so.SerNr = 333
        so.CustCode = 'ABC'
        var sorw = so.Items.newRow()
        sorw.ArtCode = 'III_0'
        so.Items.push(sorw);
        so.save()
            .catch(function (err) {
                console.log(JSON.stringify(err))
            })
            .then(function() {
                done();
            })
    });
    it("It should find the saved SalesOrder and update it", function () {
        var SalesOrder = cm.getClass("SalesOrder");
        var so = SalesOrder.new()
        so.SerNr = 333
        return so.load()
            .then(function (){
                so.Items.should.have.length(1);
                so.SalesGroup = so.SalesGroup + 'A'
                return so.save()
            })
    });
});
*/