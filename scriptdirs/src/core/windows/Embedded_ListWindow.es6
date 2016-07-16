"use strict" 
var oo = require('openorange')

var ListWindowDescription = {
    name: 'Embedded_ListWindow',
    inherits: null,
    filename: __filename
}

class Embedded_ListWindow extends oo.UIEntity {


    static initClass(descriptor) {
        super.initClass(descriptor)
        let newdesc = {}
        let parentdesc = this.__description__;
        newdesc.name = descriptor.name;
        newdesc.title = descriptor.title;
        newdesc.recordClass = descriptor.record
        newdesc.windowClass = descriptor.window
        newdesc.columns = descriptor.columns;
        newdesc.filename = descriptor.filename;
        newdesc.actions = parentdesc.actions? parentdesc.actions.slice() : []
        if (descriptor.actions) {
            for (let i = 0; i < descriptor.actions.length; i++) newdesc.actions.push(descriptor.actions[i])
        }
        this.__description__ = newdesc;
        this.__recordClass__ = null;
        this.__windowClass__ = null;
        this.__description__ = newdesc;
        return this;
    }

    static new() {
        var res = new this();
        return res;
    }

    constructor() {
        super()
        this.__class__ = this.constructor
        this.__listeners__ = []
    }

    open() {
        Embedded_ListWindow.emit('open', {listwindow: this})
    }

    setFocus() {
        this.emit("focus", {listwindow: this})
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