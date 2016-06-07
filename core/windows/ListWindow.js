"use strict"
var cm = global.__main__.require('./openorange').classmanager

var Description = {
    name: 'ListWindow',
    inherits: "Embedded_ListWindow",
}
var ListWindow = cm.createClass(Description, __filename )


module.exports = ListWindow