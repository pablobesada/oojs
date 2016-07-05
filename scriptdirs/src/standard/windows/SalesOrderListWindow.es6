"use strict";
var cm = require('openorange').classmanager

var Description = {
    name: 'SalesOrderListWindow',
    inherits: 'ListWindow',
    record: 'SalesOrder',
    window: 'SalesOrderWindow',
    title: "Sales Orders",
    columns: [
        {field: 'SerNr', label: 'Numero'},
        {field: 'CustCode'},
        {field: 'CustName'},
        {field: 'TransDate'},
        {field: 'Amount'},
    ],
    filename: __filename
}

var Parent = cm.SuperClass(Description)

class SalesOrderListWindow extends Parent {

}

module.exports = SalesOrderListWindow.initClass(Description)