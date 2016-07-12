"use strict";
let oo = require("openorange")
let cm = oo.classmanager

var Description = {
    name: 'TestRecordWindow',
    inherits: 'Window',
    record: 'TestRecord',
    title: "Test Record Window",
    form: [
        {field: 'syncVersion'},
        {field: 'SubTestName'},
        {field: 'String_Field'},
        {field: 'LinkTo_Field', name: 'LTF'},
        {field: 'Integer_Field'},
        {
            type: 'tabs', name: 'tabs', pages: [
            {
                label: "TAB1", name: 'TAB1Page', content: [
                {field: 'Rows', columns: [
                    {field: 'rowNr'},
                    {field: 'String_Field'},
                    {field: 'Integer_Field'}]
                }]

            },
            {
                label: "TAB2", name: 'TAB1Page', content: [
                {field: 'Rows', columns: [
                    {field: 'rowNr'}]
                }]

            },
        ]
        }],
    actions: [
        {label: 'askYesNo Action', methodname: 'askYesNoAction'},
        {label: 'Test Action', methodname: 'testAction'},
        {label: 'Test Action2', methodname: 'testAction2'}
    ],
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

    testAction() {
        console.log("en testAction")
    }

    testAction2() {
        console.log("en testAction2")
    }

    async askYesNoAction() {
        let res = await oo.inputString("Probando Ask yes no, ok?")
        alert(res);
    }
}


module.exports = TestRecordWindow.initClass(Description)
