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
oo.getDBConnection = oo.contextmanager.getDBConnection.bind(oo.contextmanager);
oo.beginTransaction = oo.contextmanager.beginTransaction.bind(oo.contextmanager);
oo.commit = oo.contextmanager.commit.bind(oo.contextmanager);
oo.rollback = oo.contextmanager.rollback.bind(oo.contextmanager);

//oo.windowmanager = require("./windowmanager") //should never be needed in server environment!!
module.exports = oo;