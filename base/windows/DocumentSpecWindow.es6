"use strict";
var cm = require('openorange').classmanager

var Description = {
    name: 'DocumentSpecWindow',
    inherits: 'MasterWindow',
    record: 'DocumentSpec',
    title: "DocumentSpec Window",
    form: [
        {field: 'Code', label: 'Codigo'},
        {field: 'RecordName'},
    ],
    filename: __filename,
}

var Parent = cm.SuperClass(Description)

class DocumentSpecWindow extends Parent {
    constructor() {
        super()
    }
}


module.exports = DocumentSpecWindow.initClass(Description)