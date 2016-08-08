"use strict"
let cm = require("./classmanager");
async function login(usercode, md5pass) {
    if (!usercode || usercode == '') return false;
    if (!md5pass) md5pass = null;
    let user = await cm.getClass("User").findOne({Code: usercode, Password: md5pass})
    if (user && md5pass != user.Password) user = null; //necesario para usuarios sin clave
    if (user) {
        oo.connectedClient.broadcast('postMessage', `El usuario ${usercode} se acaba de loguear`)
        return true;
    }
    return false;
}

function finish() {
    console.log("Finishing OpenOrange")
    require("./db").disconnect();
}

var oo = {}
oo.BaseEntity = require("./both/BaseEntity")
oo.UIEntity = require("./both/UIEntity")
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
oo.eventmanager = new oo.BaseEntity();
oo.finish = finish;

oo.askYesNo = async function (txt) {return oo.connectedClient.ask('askYesNo', txt)}
oo.inputString = async function (txt) {return oo.connectedClient.ask('inputString', txt)}
oo.alert = async function (txt) {return oo.connectedClient.ask('alert', txt)}
oo.postMessage = async function (txt) {return oo.connectedClient.ask('postMessage', txt)}

oo.init = function(opts) {
    if (!opts) {
        let args = require("minimist")(process.argv.slice(2))
        let settings = require(require('path').resolve(args.settingsfile || './oo.json'))
        opts = settings
    }
    oo.initDB(opts.db)
    oo.initClassManager(opts.scriptdirs)
    oo.initEventManager()
}

oo.initDB = function (dbopts) {
    require("./db").init(dbopts)
}

oo.initClassManager = function (scriptdirs) {
    oo.classmanager.init(scriptdirs)
}

oo.initEventManager = function () {
}

module.exports = oo;