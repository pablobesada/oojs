"use strict";
var cm = require('openorange').classmanager

var Description = {
    name: 'TestRecordWindow',
    inherits: 'Window',
    record: 'TestRecord',
    title: "Test Record Window",
    form: [
        {field: 'SubTestName'},
        {field: 'String_Field'},
        {field: 'Integer_Field'},
        {
            type: 'tabs', name:'tabs', pages: [
            {
                label: "TAB1", name: 'TAB1Page', content: [
                {
                    field: 'Rows', columns: [
                    {field: 'rowNr'},
                    {field: 'String_Field'},
                    {field: 'LinkTo_Field', name: 'LTF'},
                    {field: 'Integer_Field'}]
                }]
            },
        ]
        }],
    filename: __filename,
}

var Parent = cm.SuperClass(Description)

class TestRecordWindow extends Parent {
    constructor() {
        super()
    }

    async 'changed LinkTo_Field'() {
        await Parent.tryCall(this, null, "changed LinkTo_Field")
        return this.getRecord().pasteLinkTo_Field();
    }
}


module.exports = TestRecordWindow.initClass(Description)
