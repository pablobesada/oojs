"use strict"

var should = require('should');
var chance = new require("chance")()
var oo = require("openorange")
var query = oo.query;
var cm = oo.classmanager

describe("ClassManager", function () {

    it("getClass", async () => {
        should(cm.getClass("TestRecord2").getDescription().name).be.equal('TestRecord2')
    });

    it("getClass - Inheritance", async () => {
        should(cm.getClass("TestRecord2").__super__ === cm.getClass("TestRecord")).be.ok()
        should(cm.getClass("TestRecord").__super__ === cm.getClass("Record")).be.ok()
        should(cm.getClass("Record").__super__ === cm.getClass("Embedded_Record")).be.ok()
    });

});
