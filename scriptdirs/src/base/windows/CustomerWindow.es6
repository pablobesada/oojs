"use strict";
var cm = require('openorange').classmanager

var Description = {
    name: 'CustomerWindow',
    inherits: 'MasterWindow',
    record: 'Customer',
    title: "Customer Window",
    form: [
        {type: 'input', field: 'Code', label: 'Codigo'},
        {type: 'input', field: 'Name'},
    ],
    filename: __filename,
}

var Parent = cm.SuperClass(Description)

class CustomerWindow extends Parent {
    constructor() {
        super()
    }
}


module.exports = CustomerWindow.initClass(Description)