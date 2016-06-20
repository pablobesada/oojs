"use strict";
var cm = require('openorange').classmanager

var Description = {
    name: 'ItemPasteWindow',
    inherits: 'PasteWindow',
    record: 'Item',
    title: "Item Paste Window",
    pastefieldname: "Code",
    columns: [
        {field: 'Code', label: 'Codigo'},
        {field: 'Name'},
    ],
    filename: __filename
}

var Parent = cm.SuperClass(Description)

class ItemPasteWindow extends Parent {

}

module.exports = ItemPasteWindow.initClass(Description)