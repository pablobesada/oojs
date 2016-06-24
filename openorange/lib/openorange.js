"use strict"
require("babel-polyfill");

var oo = {}
oo.isServer = true;
oo.isClient = !oo.isServer;
oo.classmanager = require("./classmanager")
oo.orm = require("./orm")
oo.query = require("./serverquery")
oo.explorer = require("./both/explorer")
//context related accessors
oo.contextmanager = require("./contextmanager")
//context db accessors
oo.getDBConnection = oo.contextmanager.getDBConnection.bind(oo.contextmanager);
oo.beginTransaction = oo.contextmanager.beginTransaction.bind(oo.contextmanager);
oo.commit = oo.contextmanager.commit.bind(oo.contextmanager);
oo.rollback = oo.contextmanager.rollback.bind(oo.contextmanager);
//context user accessors
oo.currentUser = oo.contextmanager.currentUser.bind(oo.contextmanager);

module.exports = oo;