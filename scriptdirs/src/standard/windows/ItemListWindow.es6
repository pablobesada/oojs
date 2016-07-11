"use strict";
var cm = require('openorange').classmanager

var Description = {
    name: 'ItemListWindow',
    inherits: 'ListWindow',
    record: 'Item',
    window: 'ItemWindow',
    title: "Items",
    columns: [
        {field: 'Code'},
        {field: 'Name'},
    ],
    filename: __filename
}

var Parent = cm.SuperClass(Description)

class ItemListWindow extends Parent {

}

module.exports = ItemListWindow.initClass(Description)