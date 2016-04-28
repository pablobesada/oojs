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

Embedded_Window.createChildClass = function createChildClass(descriptor, filename) {
    var childclass = Object.create(this)
    childclass.__description__ = {}
    childclass.__description__.name = descriptor.name;
    childclass.__filename__ = filename;
    childclass.__super__ = this;
    return childclass;
}

Embedded_Window.init = function init() {
    this.__record__ = null;
    return this;
}

Embedded_Window.inspect = function inspect() {
    return "<" + this.__description__.name + ", from " + this.__filename__+ ">"
}

Embedded_Window.setRecord = function setRecord(rec) {
    this.__record__ = rec;
}

Embedded_Window.getRecord = function getRecord(rec) {
    return this.__record__
}

module.exports = Embedded_Window
