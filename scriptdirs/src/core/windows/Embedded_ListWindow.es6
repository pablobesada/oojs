"use strict" 
var oo = require('openorange')

var ListWindowDescription = {
    name: 'Embedded_ListWindow',
    inherits: null,
    filename: __filename
}

class Embedded_ListWindow {

    static addClassListener(listener) {
        Embedded_ListWindow.__class_listeners__.push(listener);
    }

    static notifyClassListeners(event) {
        _(Embedded_ListWindow.__class_listeners__).forEach(function (listener) {
            listener.update(event);
        })
    }

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
        this.__listeners__ = []
    }

    addListener(listener) {
        this.__listeners__.push(listener)
    }

    notifyListeners(event) {
        let self = this
        _(this.__listeners__).forEach(function (listener) {
            listener.update(event, this);
        })
    }

    open() {
        Embedded_ListWindow.notifyClassListeners({type: "listwindow", action: "open", data: this})
    }

    setFocus() {
        this.notifyListeners({type: "listwindow", action: "setFocus", data: this})
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
        return "List of " + this.getRecordClass().getDescription().name;
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

//Embedded_ListWindow.__description__ = ListWindowDescription;
Embedded_ListWindow.__class_listeners__ = []
module.exports = Embedded_ListWindow.initClass(ListWindowDescription)