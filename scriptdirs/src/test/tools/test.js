"use strict";
//require('babel-register')({
//    ignore: /node_modules\/(?!openorange)/
//});
require("babel-polyfill");

var app = require("./../../../../app")
require.prototype.main = app.module
//var oo = require("./../openorange")
var oo = require("openorange")
var Query = oo.query;
//console.log(oo.isClient)
var cm = oo.classmanager
var should = require('should');
var async = require('async')


//cm.addScriptDir("test")


require("../tools/BaseEntityTest")
require("../tools/CardTest")
require("../local/ExplorerTest")
require("../local/LoginTest")
require("../core/records/Embedded_RecordTest")
require("../core/windows/Embedded_WindowTest")
require("../local/ReportTest.js")
require("../local/ClassManagerTest")
require("../tools/ormTest")



//console.log(oo.classmanager.getClass("TestRecord").__description__)