"use strict"
var oo = require('openorange')
var cm = oo.classmanager


var Description = {
    name: 'Record',
    inherits: 'Embedded_Record',
    fields: {
        syncVersion: {type: "integer"},
    },
    filename: __filename,
}

if (oo.isClient) Description.inherits = 'ClientRecord'
//console.log("parentclass of core::item: " + ParentClass.new().__description__.name)
var Parent = cm.SuperClass(Description)
//console.log("parentclass of core::item: " + ParentClass.new().__description__.name)

class Record extends Parent {
    constructor() {
        super()
    }
}
module.exports = Record.initClass(Description)