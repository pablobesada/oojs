"use strict"
var cm = require('openorange').classmanager

var ListWindowDescription = {
    name: 'Embedded_ListWindow',
    inherits: null,
}

var Embedded_ListWindow =  Object.create({
    '__super__': null,
    '__description__': ListWindowDescription,
    '__filename__': __filename,
})


Embedded_ListWindow.createChildClass = function createChildClass(descriptor, filename) {
    var childclass = Object.create(this)
    childclass.__description__ = {}
    childclass.__description__.name = descriptor.name;
    childclass.__description__.title = descriptor.title;
    childclass.__description__.recordClass = descriptor.record
    childclass.__description__.windowClass = descriptor.window
    childclass.__description__.columns = descriptor.columns;
    //childclass.__description__.form = descriptor.form; //podria tener un form para casos de paste windows mas avanzados
    childclass.__filename__ = filename;
    childclass.__super__ = this;
    this.__recordClass__ = null;
    return childclass;
}


Embedded_ListWindow.new = function () {
    var res = Object.create(this);
    res.__class__ = this;
    return res.init();
}

Embedded_ListWindow.init = function init() {
    return this;
}

Embedded_ListWindow.open = function () {
    var wm = Object.create(window.ListWindowManager).init(this)
    wm.render($('#content')[0])
}

Embedded_ListWindow.setFocus = function setFocus() {
    window.ListWindowManager.setFocus(this)
}
Embedded_ListWindow.super = function callSuper(methodname, self) {
    if (methodname in this.__super__) {
        return this.__super__[methodname].apply(self, Array.prototype.slice.apply(arguments).slice(2));
    } else {
        return Promise.resolve()
    }
}

Embedded_ListWindow.getDescription = function getDescription() {
    return this.__description__
}

Embedded_ListWindow.inspect = function inspect() {
    return "<" + this.__description__.name + ", from " + this.__filename__+ ">"
}

Embedded_ListWindow.getTitle = function getTitle() {
    return "RECORDS";
}
module.exports = Embedded_ListWindow