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
        {field: 'SubTestName',},
        {field: 'String_Field'},
        {field: 'String_Field', editor: 'memo'},
        {field: 'LinkTo_Field', name: 'LTF'},
        {field: 'Date_Field'},
        {field: 'Date_Field', editor: 'string'},
        {field: 'Integer_Field'},
        {field: 'Integer_Field', editor: 'checkbox'},
        {field: 'Integer_Field', editor: 'radiobutton', options: [
    {label: 'CERO', value: 0},
    {label: 'UNO', value: 1},
    {label: 'DOS', value: 2}]},
        {field: 'Integer_Field', editor: 'pipeline', options: [
            {label: 'CERO', value: 0},
            {label: 'UNO', value: 1},
            {label: 'DOS', value: 2}]},

        {field: 'Integer_Field', editor: 'combobox', options: [
            {label: 'CERO', value: 0},
            {label: 'UNO', value: 1},
            {label: 'DOS', value: 2}]},
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

    async 'focus LinkTo_Field'() {
        await Parent.tryCall(this, null, "focus LinkTo_Field")
        //await this.getRecord().__class__.wait(4000)
        return true;
    }
    async 'changed LinkTo_Field'() {
        await Parent.tryCall(this, null, "changed LinkTo_Field")
        await this.getRecord().__class__.wait(1500)
        //this.getRecord().Date_Field = this.getRecord().LinkTo_Field;
        return this.getRecord().pasteLinkTo_Field();
    }

    async 'focus Date_Field'() {
        await Parent.tryCall(this, null, "focus Integer_Field")
        await this.getRecord().__class__.wait(2000)
        return this.getRecord().Integer_Field == 0;
    }

    async 'changed Integer_Field'() {
        await Parent.tryCall(this, null, "change Integer_Field")
        console.log("EN AFFFFFF")
        //await this.getRecord().__class__.wait(2000)
        return true;
    }

    testAction() {
        this.setActionEnabled('testAction', false);
    }

    testAction2() {
        this.setActionEnabled('testAction', true);
    }
    async askYesNoAction() {
        console.log("ACAAAAA")
        let res = await oo.inputString("Probando Ask yes no, ok?")
        alert(res);
    }
}


module.exports = TestRecordWindow.initClass(Description)
