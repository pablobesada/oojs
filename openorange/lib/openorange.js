//console.log("en " + __filename)

var oo = {}
oo.isServer = true;
oo.isClient = !oo.isServer;
oo.classmanager = require("./classmanager")
oo.orm = require("./orm")
//oo.windowmanager = require("./windowmanager") //should never be needed in server environment!!
module.exports = oo;