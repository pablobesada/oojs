"use strict"
var oo = require('openorange')
var cm = oo.classmanager


var Description = {
    name: 'Record',
    inherits: 'Embedded_Record',
    persistent: false,
    fields: {
        internalId: {type: "integer", persistent: true, getMaxLength: () => {return null}, getLinkToRecordClass: () => {return null}}, //si se modifica esto hay que modificarlo tambien en Row!!!
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