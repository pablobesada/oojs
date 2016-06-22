"use strict"
require("babel-polyfill");

var oo = {}
oo.isServer = true;
oo.isClient = !oo.isServer;
oo.classmanager = require("./classmanager")
oo.orm = require("./orm")
oo.query = require("./serverquery")
oo.explorer = require("./explorer")
oo.contextmanager = require("./contextmanager")
//oo.windowmanager = require("./windowmanager") //should never be needed in server environment!!
module.exports = oo;