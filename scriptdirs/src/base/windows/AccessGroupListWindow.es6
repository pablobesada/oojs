"use strict";
var cm = require('openorange').classmanager

var Description = {
    name: 'AccessGroupListWindow',
    inherits: 'ListWindow',
    record: 'AccessGroup',
    window: 'AccessGroupWindow',
    title: "Access Groups",
    columns: [
        {field: 'Code'},
    ],
    filename: __filename,
}

var Parent = cm.SuperClass(Description)

class AccessGroupListWindow extends Parent {

}

module.exports = AccessGroupListWindow.initClass(Description)