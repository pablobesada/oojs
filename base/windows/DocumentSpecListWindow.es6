"use strict";
var cm = require('openorange').classmanager

var Description = {
    name: 'DocumentSpecListWindow',
    inherits: 'ListWindow',
    record: 'DocumentSpec',
    window: 'DocumentSpecWindow',
    title: "Document Specifications",
    columns: [
        {field: 'Code', label: 'Codigo'},
        {field: 'RecordName'},
    ],
    filename: __filename
}

var Parent = cm.SuperClass(Description)

class DocumentSpecListWindow extends Parent {

}

module.exports = DocumentSpecListWindow.initClass(Description)