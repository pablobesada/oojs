"use strict";
var cm = global.__main__.require('./openorange').classmanager

var Description = {
    name: 'ItemWindow',
    inherits: 'MasterWindow',
    record: 'Item',
    title: "Item Window",
    form: [
        {type: 'input', field: 'Code', label: 'Codigo'},
        {type: 'input', field: 'Name'},
        {type: 'input', field: 'ItemGroup'},
        {type: 'input', field: 'Brand'},
    ]
}

//console.log("parentclass of core::item: " + ParentClass.new().__description__.name)
var ItemWindow = cm.createClass(Description, __filename )
//console.log("parentclass of core::item: " + ParentClass.new().__description__.name)
ItemWindow.init = function init() {
    ItemWindow.super("init", this);
    return this
}


module.exports = ItemWindow