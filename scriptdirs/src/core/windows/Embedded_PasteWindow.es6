"use strict"
var cm = require('openorange').classmanager

var PasteWindowDescription = {
    name: 'Embedded_PasteWindow',
    inherits: null,
    filename: __filename,
}

class Embedded_PasteWindow {

    constructor() {
        this.__class__ = this.constructor
    }

    static initClass(descriptor) {
        let parentdesc = this.__description__;
        let newdesc = {};
        newdesc.name = descriptor.name;
        newdesc.title = descriptor.title;
        newdesc.recordClass = descriptor.record
        newdesc.pastefieldname = descriptor.pastefieldname
        newdesc.columns = descriptor.columns;
        newdesc.filename = descriptor.filename;
        this.__description__ = newdesc;
        this.__super__ = Reflect.getPrototypeOf(this)
        return this;
    }

}

//Embedded_PasteWindow.__description__ = PasteWindowDescription

module.exports = Embedded_PasteWindow.initClass(PasteWindowDescription)