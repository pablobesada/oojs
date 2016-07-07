"use strict"
require("babel-polyfill");
let cm = require("./classmanager");
async function login(usercode, md5pass) {
    if (!usercode || usercode == '') return false;
    if (!md5pass) md5pass = '';
    let user = await cm.getClass("User").findOne({Code: usercode, Password: md5pass})
    if (user) {
        oo.connectedClient.broadcast('postMessage', `El usuario ${usercode} se acaba de loguear`)
        return true;
    }
    return false;
}

var oo = {}
oo.isServer = true;
oo.isClient = !oo.isServer;
oo.classmanager = cm;
oo.orm = require("./orm")
oo.query = require("./serverquery")
oo.explorer = require("./both/explorer")
//context related accessors
oo.contextmanager = require("./contextmanager")
//context db accessors
//console.log("DBC", oo.contextmanager.getDBConnection)
oo.getDBConnection = oo.contextmanager.getDBConnection.bind(oo.contextmanager);
oo.beginTransaction = oo.contextmanager.beginTransaction.bind(oo.contextmanager);
oo.commit = oo.contextmanager.commit.bind(oo.contextmanager);
oo.rollback = oo.contextmanager.rollback.bind(oo.contextmanager);
//context user accessors
oo.currentUser = oo.contextmanager.currentUser.bind(oo.contextmanager);
oo.login = login;
oo.getRouter = function getRouter() {return require("./router")};
oo.setSocketIO = function (socketIO) {
    oo.connectedClient = require('./pushserver')(socketIO);
}

oo.askYesNo = async function (txt) {return oo.connectedClient.ask('askYesNo', txt)}
oo.inputString = async function (txt) {return oo.connectedClient.ask('inputString', txt)}
oo.alert = async function (txt) {return oo.connectedClient.ask('alert', txt)}
oo.postMessage = async function (txt) {return oo.connectedClient.ask('postMessage', txt)}

oo.init = function(opts) {
    oo.initDB(opts.db)
    oo.initClassManager(opts.scriptdirs)
}

oo.initDB = function (dbopts) {
    require("./db").init(dbopts)
}

oo.initClassManager = function (scriptdirs) {
    oo.classmanager.init(scriptdirs)
}
module.exports = oo;