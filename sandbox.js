"use strict";
require("babel-polyfill");
require('source-map-support').install(); //solo debe usarse para debugging
require('continuation-local-storage'); //hay que importarlo muy rapido para que no tire warnings
//var app = require("./app")
global.__main__ = module
var oo = require("openorange")
var cm = oo.classmanager
oo.init()

let log = console.log.bind(console)



log(cm.getClass("Embedded_Window").__description__.actions)
log("--")
log(cm.getClass("ReportWindow").__description__.actions)
log("--")
log(cm.getClass("Window").__description__.actions)