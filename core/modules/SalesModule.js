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
    filename: __filename,
}

var Parent = cm.SuperClass(Description)

class SalesModule extends Parent {

}

module.exports = SalesModule.initClass(Description)


