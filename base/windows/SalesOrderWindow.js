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
        {field: 'CustName', pastewindow: "CustomerPasteWindow"},
        {type: 'tabs', pages: [
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
    ]
}

//console.log("parentclass of core::item: " + ParentClass.new().__description__.name)
var SalesOrderWindow = cm.createClass(Description, __filename)
//console.log("parentclass of core::item: " + ParentClass.new().__description__.name)
SalesOrderWindow.init = function init() {
    SalesOrderWindow.super("init", this);
    return this
}

SalesOrderWindow["changed SerNr"] = function () {
    SalesOrderWindow.super("changed SerNr", this);
    console.log("SO: changed SerNr: " + this.getRecord().SerNr)
}


SalesOrderWindow["changed Items.ArtCode"] = function (rowNr) {
    var self = this;
    return SalesOrderWindow.super("changed Items.ArtCode", self, rowNr)
        .then(function () {
            return self.getRecord().Items[rowNr].pasteArtCode(this);
        })

}

module.exports = SalesOrderWindow