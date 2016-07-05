"use strict"
var cm = require('openorange').classmanager

var Description = {
    name: 'ListWindow',
    inherits: "Embedded_ListWindow",
    filename: __filename
}
var Parent = cm.SuperClass(Description)

class ListWindow extends Parent {

}

module.exports = ListWindow.initClass(Description)