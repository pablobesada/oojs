"use strict"
var cm = require('openorange').classmanager

var Description = {
    name: 'Routine',
    inherits: "Embedded_Routine",
    filename: __filename,
}

//var Report = cm.createClass2(Description, __filename )

let Parent = cm.SuperClass(Description)
class Routine extends Parent {

}

module.exports = Routine.initClass(Description)