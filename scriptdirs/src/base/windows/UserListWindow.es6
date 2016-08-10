"use strict";
var cm = require('openorange').classmanager

var Description = {
    name: 'UserListWindow',
    inherits: 'ListWindow',
    record: 'User',
    window: 'UserWindow',
    title: "Users",
    columns: [
        {field: 'Code', label: 'Codigo'},
        {field: 'Name'},
        {field: 'AccessGroup'},
    ],
    filename: __filename
}

var Parent = cm.SuperClass(Description)

class UserListWindow extends Parent {

}

module.exports = UserListWindow.initClass(Description)