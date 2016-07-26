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
        {field: 'TransDate'},
        {field: 'CustName'},
        {field: 'CustName', editor: 'memo'},
        {field: 'TransTime'},
        {field: 'TransTime'},
        {field: 'CustCode', pastewindow: "CustomerPasteWindow"},
        //{type: 'card', name: 'CustomerSalesOrdersCard'},
        //{type: 'card', name: 'TimerCard'},
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
        {field: "Status", editor: "checkbox"},
        {field: "Status", editor: "string"},
        {field: "PrintFormat", editor: "string"},
        {
           type: 'tabs', pages: [
            {
                label:"Related", content: [
                {type: 'cardcontainer', name: 'CardContainer1', default: ['TestCard']},
            ]},
            {label: "TAB1", content: [
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


class ItemsContainer {
    constructor(container) {
        this.container = container
    }
    addItem(item) {
        this.container.addItem(item);
    }
}

class SalesOrderWindow extends Parent {
    constructor() {
        super()
    }

    async afterShowRecord() {
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
        await Parent.tryCall(this, null, "changed PrintFormat");
        console.log("SO: changed PrintFormat: " + this.getRecord().PrintFormat)
    }

    async "changed SerNr"() {
        super["changed SerNr"]();
        console.log("SO: changed SerNr: " + this.getRecord().SerNr)
    }


    async "changed Items.ArtCode"(rowNr) {
        var self = this;
        await Parent.tryCall(this, null, "changed Items.ArtCode", rowNr);
        //await super["changed Items.ArtCode"](rowNr)
        self.getRecord().Items[rowNr].pasteArtCode(self)
    }


    static getProvidedDataTypes() {
        let rc = Parent.getRecordClass()
        if (rc) {
            let res = rc.getProvidedDataTypes();
            res.itemsContainer = 'ItemsContainer'
            console.log("RESSS", res)
            return res
        }
        return {}
    }

    async getProvidedData() {
        let pd = await super.getProvidedData()

        pd.setData('itemsContainer', new ItemsContainer(this));
        console.log("PD", pd.keys())
        return pd
    }

    addItem(item) {
        alert("adding: " + item)
    }
}
module.exports = SalesOrderWindow.initClass(Description)