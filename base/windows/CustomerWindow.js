"use strict";
var cm = global.__main__.require('./openorange').classmanager

var Description = {
    name: 'CustomerWindow',
    inherits: 'MasterWindow',
    record: 'Customer',
    title: "Customer Window",
    form: [
        {type: 'input', field: 'Code', label: 'Codigo'},
        {type: 'input', field: 'Name'},
    ]
}

//console.log("parentclass of core::item: " + ParentClass.new().__description__.name)
var CustomerWindow = cm.createClass(Description, __filename )
//console.log("parentclass of core::item: " + ParentClass.new().__description__.name)
CustomerWindow.init = function init() {
    CustomerWindow.super("init", this);
    return this
}


module.exports = CustomerWindow