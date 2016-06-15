"use strict"
var cm = require('openorange').classmanager

var PasteWindowDescription = {
    name: 'Embedded_PasteWindow',
    inherits: null,
}
var Embedded_PasteWindow =  Object.create({
    '__super__': null,
    '__description__': PasteWindowDescription,
    '__filename__': __filename,
})


Embedded_PasteWindow.createChildClass = function createChildClass(descriptor, filename) {
    var childclass = Object.create(this)
    childclass.__description__ = {}
    childclass.__description__.name = descriptor.name;
    childclass.__description__.title = descriptor.title;
    childclass.__description__.recordClass = descriptor.record
    childclass.__description__.pastefieldname = descriptor.pastefieldname
    childclass.__description__.columns = descriptor.columns;
    //childclass.__description__.form = descriptor.form; //podria tener un form para casos de paste windows mas avanzados
    childclass.__filename__ = filename;
    childclass.__super__ = this;
    this.__recordClass__ = null;
    return childclass;
}

module.exports = Embedded_PasteWindow