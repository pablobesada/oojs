"use strict"
var cm = require("openorange").classmanager

var Description = {
    name: "SystemModule",
    inherits: "Module",
    label: "System",
    records: [
        {name: 'User', label: 'Users', access: 'UserListWindow'},
        {name: 'AccessGroup', label: 'Access Groups', access: 'AccessGroupListWindow'},
    ],
    reports: [
    ],
    routines: [
    ],
    filename: __filename,
}

var Parent = cm.SuperClass(Description)

class TestModule extends Parent {

}

module.exports = TestModule.initClass(Description)