"use strict";
var cm = global.__main__.require('./openorange').classmanager

var Description = {
    name: 'CustomerListWindow',
    inherits: 'ListWindow',
    record: 'Customer',
    title: "Customer Paste Window",
    pastefieldname: "Code",
    columns: [
        {field: 'Code', label: 'Codigo'},
        {field: 'Name'},
        {field: 'GroupCode'},
    ]
}

//console.log("parentclass of core::item: " + ParentClass.new().__description__.name)
var CustomerListWindow = cm.createClass(Description, __filename )

module.exports = CustomerListWindow