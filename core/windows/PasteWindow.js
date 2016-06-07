"use strict"
var cm = global.__main__.require('./openorange').classmanager

var Description = {
    name: 'PasteWindow',
    inherits: "Embedded_PasteWindow",
}
var PasteWindow = cm.createClass(Description, __filename )


module.exports = PasteWindow