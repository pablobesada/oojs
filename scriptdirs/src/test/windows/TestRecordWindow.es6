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
        {label: 'askYesNo Action', method: 'askYesNoAction'},
        {label: 'Test Action', method: 'testAction'},
        {label: 'Test Action2', method: 'testAction2'}
    ],
    filename: __filename,
}

var Parent = cm.SuperClass(Description)

class TestRecordWindow extends Parent {

    constructor() {
        super()
        this.show_action = true;
    }

    async 'changed LinkTo_Field'() {
        await Parent.tryCall(this, null, "changed LinkTo_Field")
        return this.getRecord().pasteLinkTo_Field();
    }

    testAction() {
        this.show_action = false;
        this.emit("action status modified", {method: 'testAction'})
    }

    testAction2() {
        this.show_action = true;
        this.emit("action status modified", {method: 'testAction'})
        console.log("en testAction2")
    }

    isActionRelevant(actiondef) {
        if (actiondef.method == 'testAction') return this.show_action;
        return super.isActionRelevant(actiondef)
    }

    async askYesNoAction() {
        console.log("ACAAAAA")
        let res = await oo.inputString("Probando Ask yes no, ok?")
        alert(res);
    }
}


module.exports = TestRecordWindow.initClass(Description)
