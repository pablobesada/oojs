"use strict"
var oo = require('openorange')

var ListWindowDescription = {
    name: 'Embedded_ListWindow',
    inherits: null,
    filename: __filename
}

class Embedded_ListWindow {


    static initClass(descriptor) {
        let newdesc = {}
        newdesc.name = descriptor.name;
        newdesc.title = descriptor.title;
        newdesc.recordClass = descriptor.record
        newdesc.windowClass = descriptor.window
        newdesc.columns = descriptor.columns;
        newdesc.filename = descriptor.filename;
        this.__description__ = newdesc;
        this.__super__ = Reflect.getPrototypeOf(this)
        this.__recordClass__ = null;
        this.__windowClass__ = null;
        return this;
    }

    static new() {
        var res = new this();
        return res;
    }

    constructor() {
        this.__class__ = this.constructor
    }

    open() {
        var wm = Object.create(oo.listwindowmanager).init(this)
        wm.render($('#content')[0])
    }

    setFocus() {
        oo.listwindowmanager.setFocus(this)
    }

    static tryCall(self, methodname) {
        if (methodname in this) {
            return this[methodname].apply(self, Array.prototype.slice.apply(arguments).slice(2));
        } else {
            return Promise.resolve();
        }
    }

    static getDescription() {
        return this.__description__
    }

    inspect() {
        return "<" + this.__class__.__description__.name + ", from " + this.__class__.__description__.filename + ">"
    }

    getTitle() {
        return "RECORDS";
    }

    getRecordClass() {
        if (this.__class__.__recordClass__ == null && this.__class__.__description__.recordClass) {
            this.__class__.__recordClass__ = oo.classmanager.getClass(this.__class__.__description__.recordClass)
        }
        return this.__class__.__recordClass__
    }

    getWindowClass() {
        if (this.__class__.__windowClass__ == null && this.__class__.__description__.windowClass) {
            this.__class__.__windowClass__ = oo.classmanager.getClass(this.__class__.__description__.windowClass)
        }
        return this.__class__.__windowClass__
    }

}

Embedded_ListWindow.__description__ = ListWindowDescription;

module.exports = Embedded_ListWindow