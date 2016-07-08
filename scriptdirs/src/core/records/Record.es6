"use strict"
var oo = require('openorange')
var cm = oo.classmanager


var Description = {
    name: 'Record',
    inherits: 'Embedded_Record',
    persistent: false,
    fields: {
        syncVersion: {type: "integer"},
    },
    filename: __filename,
}

if (oo.isClient) Description.inherits = 'ClientRecord'
var Parent = cm.SuperClass(Description)

class Record extends Parent {
    constructor() {
        super()
    }

    defaults() {

    }
}
module.exports = Record.initClass(Description)