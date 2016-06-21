"use strict"

var cm = require('openorange').classmanager


var Description = {
    name: 'TestRecordRow',
    inherits: 'Row',
    fields: {
        String_Field: {type: "string", length: 60},
        Integer_Field: {type: "integer"},
    },
    filename: __filename,
}

var Parent = cm.SuperClass(Description)

class TestRecordRow extends Parent {

    constructor() {
        super()
    }

}

module.exports = TestRecordRow.initClass(Description)