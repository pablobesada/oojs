"use strict"
var oo = require('openorange')
var cm = oo.classmanager


var Description = {
    name: 'DocumentSpec',
    inherits: 'Master',
    fields: {
        RecordName: {type: "string", length: 20},
        Fields: {type: "detail", class:"DocumentSpecFieldsRow"},
    },
    filename: __filename,
}

var Parent = cm.SuperClass(Description)

class DocumentSpec extends Parent {
    constructor() {
        super()
    }


    open() {
        var wm = Object.create(oo.ui.documentmanager).init(this)
        wm.render()
    }
}
module.exports = DocumentSpec.initClass(Description)