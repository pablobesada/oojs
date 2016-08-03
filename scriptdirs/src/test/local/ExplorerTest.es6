"use strict"

var should = require('should');
var chance = new require("chance")()
var oo = require("openorange")
var query = oo.query;
var cm = oo.classmanager

describe("Explorer", function () {

    it("It should find TestRecord", async () => {
        let res = await oo.explorer.findAllModules();
        console.log("RES",res)
    });

    it.only("search for specific record", async () => {
        let res = await oo.explorer.search('Cliente');
        console.log(res)
    });

});
