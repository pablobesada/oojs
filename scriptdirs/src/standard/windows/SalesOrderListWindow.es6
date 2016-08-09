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
        {field: 'User'},
    ],
    filename: __filename,
    suggested_searches: [
        {label: 'Registros Abiertos', query: 'Status=0'},
        {label: 'Registros de hoy', query: 'TransDate=$today'},
        {label: 'Creados por mi', query: 'User=$user'},
    ]
}

var Parent = cm.SuperClass(Description)

class SalesOrderListWindow extends Parent {

}

module.exports = SalesOrderListWindow.initClass(Description)