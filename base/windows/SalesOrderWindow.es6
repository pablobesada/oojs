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
                label: "TAB1", content: [
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
                label: "TAB2", content: [
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

//console.log("parentclass of core::item: " + ParentClass.new().__description__.name)
var Parent = cm.SuperClass(Description)
//console.log("parentclass of core::item: " + ParentClass.new().__description__.name)
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