"use strict";
var app = require("./../app")
var chance = new require("chance")()
var _ = require("underscore")
require.prototype.main = app.module
var oo = require("./../openorange")
console.log(oo.isClient)
var cm = oo.classmanager
var ct = oo.client_tools
var should = require('should');

function fillRecord(record){
    var fields = record.__description__.fields
    _(fields).forEach(function(fielddef, fn) {
        if (fn == 'masterId') return;
        if (fn == 'rowNr') return;
        switch (fielddef.type) {
            case 'string':
                record[fn] = chance.word({length: 4});
                break;
            case 'integer':
                record[fn] = chance.natural();
                break;
            case 'detail':
                var nrows = chance.natural({min: 1, max: 13})
                for (var j=0;j<nrows;j++) {
                    var row = record[fn].newRow()
                    fillRecord(row)
                    record[fn].push(row)
                }
        }
    });
    return record;
}

describe("Client", function () {
    it("control client decoration", function () {
        var SalesOrder = cm.getClass("SalesOrder");
        var so = SalesOrder.new()
        so.SerNr=333
        ct.always_run_in_server_promise(so, "load")
        var res = so.load();
        return res;
    });
});


describe("Record", function () {
    before(function (done) {
        var SalesOrder = cm.getClass("SalesOrder");
        var so = SalesOrder.new()
        so.SerNr = 333
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
