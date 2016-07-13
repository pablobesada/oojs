"use strict";
var cm = require('openorange').classmanager

var Description = {
    name: 'SalesOrderWindow',
    inherits: 'SalesTransactionWindow',
    record: 'SalesOrder',
    title: "Sales Order",
    form: [
        {field: 'User', label: 'Usuario'},
        {field: 'SerNr', label: 'Numero'},
        {field: 'CustName'},
        {field: 'TransTime'},
        {field: 'CustCode', pastewindow: "CustomerPasteWindow"},
        {type: 'card', name: 'CustomerSalesOrdersCard'},
        {type: 'card', name: 'TimerCard'},
        {field: 'TransDate'},
        {field: 'PrintFormat', editor: 'combobox', options: [
            {label: 'Normal', value: 0},
            {label: 'Sum per Item', value: 1},
            {label: 'Sum per Origin', value: 3},
        ]},
        {field: "Status", editor: "checkbox"},
        {
            type: 'tabs', pages: [
            {
                label: "TAB1", content: [
                {
                    field: 'Items', columns: [
                    {field: 'rowNr'},
                    {field: 'masterId'},
                    {field: 'DeliveryTimeRow', editor: "time"},
                    {field: 'DeliveryDateRow', editor: "date"},
                    {field: 'OriginType', editor: "string"},
                    {field: 'OriginType', editor: "checkbox"},
                    {field: 'ArtCode', label: 'Codigo', pastewindow: "ItemPasteWindow"},
                    {field: 'Name', label: 'Name'}]
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
            {
                label: "TAB3", content: [
                {type: 'reportview', name: 'Contacts'}
            ]}

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

    async afterShowRecord() {
        console.log("en afterShowReocrd")
        let report = cm.getClass("CustomerListReport").new()
        //report.defaults()
        //report.ShowReportTitle = False
        report.setView(this.getReportView("Contacts"))
        //report.getRecord().CustCode = record.Code
        //report.getRecord().ContactType = 0
        //report.getRecord().HideCode = True
        //report.getRecord().JoinNames = True
        //report.open(False)
        report.open(false)
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
        console.log(4, rowNr)
        var self = this;
        console.log(5)
        await Parent.tryCall(this, null, "changed Items.ArtCode", rowNr);
        console.log(6)
        //await super["changed Items.ArtCode"](rowNr)
        self.getRecord().Items[rowNr].pasteArtCode(self)
        console.log(7)
    }
}
module.exports = SalesOrderWindow.initClass(Description)