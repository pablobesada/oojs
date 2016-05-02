"use strict";
var cm = global.__main__.require('./openorange').classmanager

var Description = {
    name: 'SalesOrderWindow',
    inherits: 'SalesTransactionWindow',
    title: "Ventana Test",
    form: [
        {type: 'input', field: 'SerNr', label: 'Numero'},
        {type: 'input', field: 'CustCode'},
        {type: 'input', field: 'CustName'}
    ]
}

//console.log("parentclass of core::item: " + ParentClass.new().__description__.name)
var SalesOrderWindow = cm.createClass(Description, __filename )
//console.log("parentclass of core::item: " + ParentClass.new().__description__.name)
SalesOrderWindow.init = function init() {
    SalesOrderWindow.super("init", this);
    return this
}

SalesOrderWindow["changed SerNr"] = function () {
    SalesOrderWindow.super("changed SerNr", this);
    console.log("SO: changed SerNr: " + this.getRecord().SerNr)
}

module.exports = SalesOrderWindow