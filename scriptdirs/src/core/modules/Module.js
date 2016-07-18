"use strict"

var ModuleDescription = {
    name: 'Module',
    inherits: null,
    records: [],
    reports: [],
    routines: [],
    filename: __filename
}


class Module {


    static new() {
        let res = new this();
        res.__class__ = this;
        res;
    }
    static initClass(descriptor) {
        this.__description__ = {}
        this.__description__.name = descriptor.name;
        this.__description__.records = 'records' in descriptor ? descriptor.records : [];
        this.__description__.reports = 'reports' in descriptor ? descriptor.reports : [];
        this.__description__.filename = descriptor.filename;
        this.__super__ = Reflect.getPrototypeOf(this);
        return this;
    }



    static getDescription() {
        return this.__description__
    }
}

Module.__description__ = ModuleDescription


module.exports = Module

