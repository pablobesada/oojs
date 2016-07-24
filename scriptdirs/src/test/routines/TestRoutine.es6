"use strict"
var cm = require('openorange').classmanager

var Description = {
    name: 'TestRoutine',
    inherits: "Routine",
    title: 'Test Routine',
    filename: __filename,
}

//var Report = cm.createClass2(Description, __filename )

let Parent = cm.SuperClass(Description)
class TestRoutine extends Parent {

    run() {
        console.log("en Run de TestRoutine")
    }
}

module.exports = TestRoutine.initClass(Description)