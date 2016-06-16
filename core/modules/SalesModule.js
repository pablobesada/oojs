"use strict"
var cm = require("openorange").classmanager

var Description = {
    name: "SalesModule",
    inherits: "Module",
    label: "Ventas",
    records: [
        {name: 'Customer', label: 'Clientes', access: 'CustomerListWindow'},
        {name: 'Item', label: 'Articulos', access: 'ItemListWindow'},
        {name: 'SalesOrder', label: 'Ordenes de Venta', access: 'SalesOrderListWindow'},
        {name: 'Invoice', label: 'Facturas', access: 'InvoiceListWindow'},
    ],
    reports: [
        {name: 'CustomerListReport', label: 'Listado de Clientes'},
    ],
}

var SalesModule = cm.createClass(Description, __filename )


module.exports = SalesModule


