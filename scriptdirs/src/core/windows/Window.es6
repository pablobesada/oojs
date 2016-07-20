"use strict";
var cm = require('openorange').classmanager

var Description = {
    name: 'Window',
    inherits: 'Embedded_Window',
    filename: __filename,
    actions: [
        {label: 'Save', method: 'save', icon: 'done', group: 'basic', shortcut: 'shift+enter'},
        {label: 'Delete', method: 'delete', icon: 'delete', group: 'basic'},
        {label: 'Print', method: 'print', icon: 'print', group: 'basic', shortcut: 'ctrl+p'},
    ],
}

//console.log("parentclass of core::item: " + ParentClass.new().__description__.name)
var Parent = cm.SuperClass(Description)
//console.log("parentclass of core::item: " + ParentClass.new().__description__.name)
class Window extends Parent {
    constructor() {
        super()
    }
}
module.exports = Window.initClass(Description)