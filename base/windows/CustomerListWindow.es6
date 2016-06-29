"use strict";
var cm = require('openorange').classmanager

var Description = {
    name: 'CustomerListWindow',
    inherits: 'ListWindow',
    record: 'Customer',
    window: 'CustomerWindow',
    title: "Customers",
    columns: [
        {field: 'Code', label: 'Codigo'},
        {field: 'Name'},
        {field: 'GroupCode'},
    ],
    filename: __filename
}

var Parent = cm.SuperClass(Description)

class CustomerListWindow extends Parent {

}

module.exports = CustomerListWindow.initClass(Description)