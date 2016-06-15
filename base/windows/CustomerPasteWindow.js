"use strict";
var cm = require('openorange').classmanager

var Description = {
    name: 'CustomerPasteWindow',
    inherits: 'PasteWindow',
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
var CustomerPasteWindow = cm.createClass(Description, __filename )

module.exports = CustomerPasteWindow