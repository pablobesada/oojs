"use strict";

var app = require("./../app");
require.prototype.main = app.module;
var oo = require("./../openorange");
var cm = oo.classmanager;
var should = require('should');

describe("Record", function () {
    before(function (done) {
        var SalesOrder = cm.getClass("SalesOrder");
        var so = SalesOrder.new();
        so.SerNr = 333;
        so.load().then(function () {
            console.log("is new: " + so.isNew());
        }).then(function () {
            so.delete();
        }).then(done);
    });

    it("It should create a Record", function (done) {
        var SalesOrder = cm.getClass("SalesOrder");
        var so = SalesOrder.new();
        so.SerNr = 333;
        done();
    });

    it("It should save a SalesOrder", function (done) {
        var SalesOrder = cm.getClass("SalesOrder");
        var so = SalesOrder.new();
        so.SerNr = 333;
        so.CustCode = 'ABC';
        var sorw = so.Items.newRow();
        sorw.ArtCode = 'III_0';
        so.Items.push(sorw);
        so.save().catch(function (err) {
            console.log(JSON.stringify(err));
        }).then(function () {
            done();
        });
    });
    it("It should find the saved SalesOrder", function () {
        var SalesOrder = cm.getClass("SalesOrder");
        var so = SalesOrder.new();
        so.SerNr = 333;
        return so.load().then(function () {
            so.Items.should.have.length(1);
        });
    });
});

//# sourceMappingURL=test-compiled.js.map