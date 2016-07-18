"use strict";
var cm = require('openorange').classmanager

var Description = {
    name: 'ItemWindow',
    inherits: 'MasterWindow',
    record: 'Item',
    title: "Item Window",
    form: [
        {field: 'syncVersion'},
        {type: 'input', field: 'Code', label: 'Codigo'},
        {type: 'input', field: 'Name'},
        {type: 'input', field: 'ItemGroup'},
        {type: 'input', field: 'Brand'},
    ],
    filename: __filename
}

var Parent = cm.SuperClass(Description)
class ItemWindow extends Parent {
    constructor() {
        super()
    }
}

module.exports = ItemWindow.initClass(Description)