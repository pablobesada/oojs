"use strict";

var WindowDescription = {
    name: 'Embedded_Window',
    inherits: null,
}

var Embedded_Window = Object.create({
    '__super__': null,
    '__description__': WindowDescription,
    '__filename__': __filename,
})

Embedded_Window.new = function () {
    return Object.create(this).init();
}

Embedded_Window.open = function () {
    var WindowManager = require("./openorange/lib/windowmanager")
    var wm = Object.create(WindowManager).init(this)
    wm.render($('#content')[0])
}

Embedded_Window.createChildClass = function createChildClass(descriptor, filename) {
    var childclass = Object.create(this)
    childclass.__description__ = {}
    childclass.__description__.name = descriptor.name;
    childclass.__description__.title = descriptor.title;
    childclass.__description__.form = descriptor.form;
    childclass.__filename__ = filename;
    childclass.__super__ = this;
    return childclass;
}

Embedded_Window.init = function init() {
    this.__record__ = null;
    return this;
}

Embedded_Window.super = function callSuper(methodname, self) {
    if (methodname in this.__super__) {
        return this.__super__[methodname].apply(self, arguments);
    } else {
        return Promise.resolve();
    }
}

Embedded_Window.getDescription = function getDescription() {
    return this.__description__
}

Embedded_Window.inspect = function inspect() {
    return "<" + this.__description__.name + ", from " + this.__filename__+ ">"
}

Embedded_Window.getTitle = function getTitle() {
    return this.getDescription().title;
}

Embedded_Window.setRecord = function setRecord(rec) {
    this.__record__ = rec;
}

Embedded_Window.getRecord = function getRecord(rec) {
    return this.__record__
}

Embedded_Window.afterEdit = function afterEdit(fieldname, value) {
    var self = this;
    self.getRecord()[fieldname] = value;
    if ('changed ' + fieldname in this) {
        this['changed ' + fieldname]()
    }
}

Embedded_Window.save = function save() {
    var rec = this.getRecord();
    if (rec != null) return rec.save();
}

module.exports = Embedded_Window
