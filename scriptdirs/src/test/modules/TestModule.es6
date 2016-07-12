"use strict"
var cm = require("openorange").classmanager

var Description = {
    name: "TestModule",
    inherits: "Module",
    label: "Test",
    records: [
        {name: 'TestRecord', label: 'Test Record', access: 'TestRecordListWindow'},
    ],
    filename: __filename,
}

var Parent = cm.SuperClass(Description)

class TestModule extends Parent {

}

module.exports = TestModule.initClass(Description)