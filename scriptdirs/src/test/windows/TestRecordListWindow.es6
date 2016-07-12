"use strict";
var cm = require('openorange').classmanager

var Description = {
    name: 'TestRecordListWindow',
    inherits: 'ListWindow',
    record: 'TestRecord',
    window: 'TestRecordWindow',
    title: "Test Records",
    columns: [
        {field: 'internalId'},
        {field: 'String_Field'},
        {field: 'TestName'},
        {field: 'SubTestName'},
    ],
    filename: __filename
}

var Parent = cm.SuperClass(Description)

class TestRecordListWindow extends Parent {

}

module.exports = TestRecordListWindow.initClass(Description)