"use strict";
var cm = global.__main__.require('./openorange').classmanager

var Description = {
    name: 'SalesOrderWindow',
    inherits: 'SalesTransactionWindow',
    record: 'SalesOrder',
    title: "Sales Order",
    form: [
        {field: 'syncVersion', label: 'sync'},
        {field: 'SerNr', label: 'Numero'},
        {field: 'CustCode'},
        {field: 'TransTime'},
        {field: 'TransTime', editor: 'string'},
        {field: 'TransTime', editor: 'string'},

        {field: 'TransDate'},
        {field: 'TransDate', editor: 'string'},
        {field: 'TransDate', editor: 'string'},
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
                    {field: 'ArtCode', label: 'Codigo'},
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
                    {field: 'ArtCode', label: 'Codigo'},
                    {field: 'Name', label: 'Descripcion'},
                ]
                }
            ]
            },
        ]
        }
    ]
}

//console.log("parentclass of core::item: " + ParentClass.new().__description__.name)
var SalesOrderWindow = cm.createClass(Description, __filename)
//console.log("parentclass of core::item: " + ParentClass.new().__description__.name)
SalesOrderWindow.init = function init() {
    SalesOrderWindow.super("init", this);
    return this
}

SalesOrderWindow["changed PrintFormat"] = function () {
    SalesOrderWindow.super("changed PrintFormat", this);
    console.log("SO: changed PrintFormat: " + this.getRecord().PrintFormat)
}

SalesOrderWindow["changed SerNr"] = function () {
    SalesOrderWindow.super("changed SerNr", this);
    console.log("SO: changed SerNr: " + this.getRecord().SerNr)
}


SalesOrderWindow["changed Items.ArtCode"] = function (rowNr) {
    var self = this;
    return SalesOrderWindow.super("changed Items.ArtCode", this, rowNr)
        .then(function () {
            self.getRecord().Items[rowNr].Name += 'X'
        })
}

module.exports = SalesOrderWindow