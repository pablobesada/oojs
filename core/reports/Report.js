"use strict"
var cm = require('openorange').classmanager

var Description = {
    name: 'Report',
    inherits: "Embedded_Report",
}
var Report = cm.createClass(Description, __filename )

module.exports = Report