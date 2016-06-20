"use strict"
var cm = require('openorange').classmanager

var Description = {
    name: 'PasteWindow',
    inherits: "Embedded_PasteWindow",
    filename: __filename,
}
var Parent = cm.SuperClass(Description)

class PasteWindow extends Parent {

}
module.exports = PasteWindow.initClass(Description)