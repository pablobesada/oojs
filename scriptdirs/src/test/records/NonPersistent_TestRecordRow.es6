"use strict"

var cm = require('openorange').classmanager


var Description = {
    name: 'NonPersistent_TestRecordRow',
    inherits: 'Row',
    persistent: false,
    fields: {
        String_Field: {type: "string", length: 60},
        Integer_Field: {type: "integer"},
    },
    filename: __filename,
}

var Parent = cm.SuperClass(Description)

class NonPersistent_TestRecordRow extends Parent {

    constructor() {
        super()
    }

}

module.exports = NonPersistent_TestRecordRow.initClass(Description)