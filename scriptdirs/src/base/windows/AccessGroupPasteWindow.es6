"use strict"; 
var cm = require('openorange').classmanager

var Description = {
    name: 'AccessGroupPasteWindow',
    inherits: 'PasteWindow',
    record: 'AccessGroup',
    window: 'AccessGroupWindow',
    title: "AccessGroup Paste Window",
    pastefieldname: "Code",
    columns: [
        {field: 'Code', label: 'Codigo'},
    ],
    filename: __filename,
}

//console.log("parentclass of core::item: " + ParentClass.new().__description__.name)
var Parent = cm.SuperClass(Description)
class AccessGroupPasteWindow extends Parent {
}

module.exports = AccessGroupPasteWindow.initClass(Description)