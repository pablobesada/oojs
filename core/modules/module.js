"use strict"

var ModuleDescription = {
    name: 'Module',
    inherits: null,
    records: [],
    reports: [],
    routines: []
}

var Module = Object.create({
    '__super__': null,
    '__description__': ModuleDescription,
    '__filename__': __filename,
})

Module.new = function () {
    var res = Object.create(this);
    res.__class__ = this;
    return res.init();
}


Module.createChildClass = function createChildClass(descriptor, filename) {
    var childclass = Object.create(this)
    childclass.__description__ = {}
    childclass.__description__.name = descriptor.name;
    childclass.__description__.records = 'records' in descriptor? descriptor.records : [];
    childclass.__description__.reports = 'reports' in descriptor? descriptor.reports : [];
    childclass.__filename__ = filename;
    childclass.__super__ = this;
    return childclass;
}

Module.init = function init() {
    return this;
}

Module.getDescription = function getDescription() {
    return this.__description__
}

module.exports = Module

