"use strict";
var cm = require('openorange').classmanager

var Description = {
    name: 'TestRecord2Window',
    inherits: 'TestRecordWindow',
    record: 'TestRecord2',
    title: "Test Record 2 Window",
    filename: __filename,
    override: [
        {add: {field: "internalId", label: "added after LTF"}}
    ]
}

var Parent = cm.SuperClass(Description)

class TestRecord2Window extends Parent {
    constructor() {
        super()
    }
}


module.exports = TestRecord2Window.initClass(Description)