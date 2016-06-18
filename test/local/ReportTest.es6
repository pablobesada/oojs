"use strict";
var app = require("./../../app")
var chance = new require("chance")()
var _ = require("underscore")
var oo = require("openorange")
var Query = oo.query;
var cm = oo.classmanager
var should = require('should');
var async = require('async')
var utils = require("../utils")

describe("Report", function () {
    it("create a report", async () => {
        let report = cm.getClass("CustomerListReport").new()
        console.log(report.__class__.__description__.filename)
        await report.run()
        //console.log(report.getHTML())
    })
});