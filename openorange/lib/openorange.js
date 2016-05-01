//console.log("en " + __filename)

var oo = {}
oo.isServer = true;
oo.isClient = !oo.isServer;
oo.classmanager = require("./classmanager")
oo.orm = require("./orm")
oo.client_tools = require("./client_tools")
module.exports = oo;