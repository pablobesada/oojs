"use strict";
var cm = require('openorange').classmanager

var Description = {
    name: 'SalesOrderWindow',
    inherits: 'SalesTransactionWindow',
    record: 'SalesOrder',
    title: "Sales Order",
    form: [
        {field: 'syncVersion', label: 'sync'},
        {field: 'SerNr', label: 'Numero'},
        {field: 'CustCode'},
        {field: 'CustName', pastewindow: "CustomerPasteWindow"},
        {
            type: 'tabs', pages: [
            {
                label: "TAB1", name: 'TAB1Page', content: [
                {
                    field: 'Items', columns: [
                    {field: 'rowNr'},
                    {field: 'ArtCode', label: 'Codigo'},
                    {field: 'Name', label: 'Descripcion'},
                ]
                }
            ]
            },
            {
                label: "TAB2", name: 'TAB2Page', content: [
                {
                    field: 'Items', columns: [
                    {field: 'rowNr'},
                    {field: 'ArtCode', label: 'Codigo'},
                    {field: 'Name', label: 'Descripcion'},
                ]
                }
            ]
            },
        ]
        }
    ],
    filename: __filename
}

var Parent = cm.SuperClass(Description)
class SalesOrderWindow extends Parent {
    constructor() {
        super()
    }

    async "changed SerNr"() {
        await super["changed SerNr"]()
        console.log("SO: changed SerNr: " + this.getRecord().SerNr)
    }


    async "changed Items.ArtCode"(rowNr) {
        var self = this;
        await super["changed Items.ArtCode"](rowNr);
        return self.getRecord().Items[rowNr].pasteArtCode(this);
    }
}

module.exports = SalesOrderWindow.initClass(Description)