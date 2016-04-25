"use strict";
var app = require("./../app")
require.prototype.main = app.module
console.log("AA:" + global.__main__)
console.log(require.prototype)
var oo = require("./../openorange")
var cm = oo.classmanager


describe("Record", function () {
    before(function (done) {
        done();
    })

    it("It should create a Record", function (done) {
        var SalesOrder = cm.getClass("SalesOrder");
        var so = SalesOrder.new()
        so.SerNr = 444
        done()
    });
});
