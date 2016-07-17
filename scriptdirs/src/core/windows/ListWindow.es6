"use strict"
var cm = require('openorange').classmanager

var Description = {
    name: 'ListWindow',
    inherits: "Embedded_ListWindow",
    filename: __filename,
    actions: [
        {label: 'New', method: 'newRecord', icon: 'add', group: 'basic', shortcut: 'ctrl+n'},
    ]
}
var Parent = cm.SuperClass(Description)

class ListWindow extends Parent {

    async newRecord() {
        var self = this;
        var record = self.getRecordClass().new()
        var window = self.getWindowClass().new();
        await record.defaults();
        window.setRecord(record);
        window.open();
        window.setFocus();
    }
}

module.exports = ListWindow.initClass(Description)