"use strict";
var cm = require('openorange').classmanager

var Description = {
    name: 'SalesOrderWindow',
    inherits: 'SalesTransactionWindow',
    record: 'SalesOrder',
    title: "Sales Order",
    form: [
        {type: "column", content: [
            {field: 'syncVersion', label: 'sync2'},
            {type: "line", content: [
                {field: 'SerNr', label: 'Numero'},
                {field: 'CustCode'},
                {field: 'TransTime'},
                {field: 'TransTime', editor: 'string'},
                {field: 'TransTime', editor: 'string'},
            ]},
            {field: 'CustCode', pastewindow: "CustomerPasteWindow"},
        ]},

        {field: 'TransDate'},
        {field: 'TransDate', editor: 'string'},
        {field: 'TransDate', editor: 'string'},
        {field: 'CustName'},
        {field: 'CustName'},
        {field: 'PrintFormat'},
        {field: 'PrintFormat', editor: 'radiobutton', options: [
            {label: 'Normal', value: 0},
            {label: 'Sum per Item', value: 1},
            {label: 'Sum per Origin', value: 3},
        ]},
        {field: 'PrintFormat', editor: 'combobox', options: [
            {label: 'Normal', value: 0},
            {label: 'Sum per Item', value: 1},
            {label: 'Sum per Origin', value: 3},
        ]},
        {field: 'User'},
        {field: "Status", editor: "checkbox"},
        {field: "Status", editor: "integer"},
        {field: 'Status', editor: 'combobox', options: [
            {label: 'NO', value: 0},
            {label: 'YES', value: 1},
        ]},
        {field: 'Status', editor: 'radiobutton', options: [
            {label: 'NO', value: 0},
            {label: 'YES', value: 1},
        ]},
        //{field: "Status", editor: "integer"},
        {
            type: 'tabs', pages: [
            {
                label: "TAB1", content: [
                {
                    field: 'Items', columns: [
                    {field: 'rowNr'},
                    {field: 'masterId'},
                    {field: 'DeliveryTimeRow', editor: "string"},
                    {field: 'DeliveryTimeRow', editor: "time"},
                    {field: 'DeliveryDateRow', editor: "string"},
                    {field: 'DeliveryDateRow', editor: "date"},
                    {field: 'OriginType', editor: "string"},
                    {field: 'OriginType', editor: "checkbox"},
                    {field: 'ArtCode', label: 'Codigo', pastewindow: "ItemPasteWindow"},
                    {field: 'Name', label: 'Name'},
                    {field: 'Name', label: 'Descripcion', editor: 'combobox', options: [
                        {label: 'Normal', value: 0},
                        {label: 'Sum per Item', value: 1},
                        {label: 'Sum per Origin', value: 3},
                    ]},
                ]
                }
            ]
            },
            {
                label: "TAB2", content: [
                {
                    field: 'Items', columns: [
                    {field: 'ArtCode', label: 'Codigo', pastewindow: 'ItemPasteWindow'},
                    {field: 'Name', label: 'Descripcion'},
                ]
                }
            ]
            },
        ]
        }
    ],
    filename: __filename,
}

var Parent = cm.SuperClass(Description)

class SalesOrderWindow extends Parent {
    constructor() {
        super()
    }

    async "changed PrintFormat"() {
        await super["changed PrintFormat"]();
        console.log("SO: changed PrintFormat: " + this.getRecord().PrintFormat)
    }

    async "changed SerNr"() {
        super["changed SerNr"]();
        console.log("SO: changed SerNr: " + this.getRecord().SerNr)
    }


    async "changed Items.ArtCode"(rowNr) {
        var self = this;
        await super["changed Items.ArtCode"](rowNr)
        self.getRecord().Items[rowNr].Name += 'X'
    }
}
module.exports = SalesOrderWindow.initClass(Description)