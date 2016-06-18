"use strict"
var cm = require('openorange').classmanager

var Description = {
    name: 'Report',
    inherits: "Embedded_Report",
    filename: __filename,
}

//var Report = cm.createClass2(Description, __filename )

let Parent = cm.SuperClass(Description)
class Report extends Parent {

}

module.exports = Report.initClass(Description)