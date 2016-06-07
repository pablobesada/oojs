"use strict";
var cm = global.__main__.require('./openorange').classmanager

var Description = {
    name: 'ItemPasteWindow',
    inherits: 'PasteWindow',
    record: 'Item',
    title: "Item Paste Window",
    pastefieldname: "Code",
    columns: [
        {field: 'Code', label: 'Codigo'},
        {field: 'Name'},
    ]
}

var ItemPasteWindow = cm.createClass(Description, __filename )

module.exports = ItemPasteWindow