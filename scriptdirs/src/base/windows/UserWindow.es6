"use strict";
var cm = require('openorange').classmanager

var Description = {
    name: 'UserWindow',
    inherits: 'MasterWindow',
    record: 'User',
    title: "User Window",
    form: [
        {field: 'Code', label: 'Codigo'},
        {field: 'Name'},
        {field: 'AccessGroup', pastewindow: 'AccessGroupPasteWindow'},
    ],
    filename: __filename,
}

var Parent = cm.SuperClass(Description)

class UserWindow extends Parent {
    constructor() {
        super()
    }
}


module.exports = UserWindow.initClass(Description)