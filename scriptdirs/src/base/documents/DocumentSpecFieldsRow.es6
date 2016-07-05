"use strict"
var oo = require('openorange')
var cm = oo.classmanager


var Description = {
    name: 'DocumentSpecFieldsRow',
    inherits: 'Row',
    fields: {
        Name: {type: "string", length: 50},
        Style: {type: "string", length: 20},
        Alignment: {type: "integer"},
        Decimals: {type: "integer"},
        X: {type: "integer"},
        Y: {type: "integer"},
        Width: {type: "integer"},
        Type: {type: "integer"},
        TextLimit: {type: "integer"},
    },
    filename: __filename,
}

var Parent = cm.SuperClass(Description)

class DocumentSpecFieldsRow extends Parent {
    constructor() {
        super()
    }
}
module.exports = DocumentSpecFieldsRow.initClass(Description)