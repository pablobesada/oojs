"use strict" 
var oo = require('openorange')

var Description = {
    name: 'Embedded_DocumentView',
    inherits: null,
    filename: __filename,
    actions: [
        {label: 'Print', method: 'print', icon: 'print', group: 'basic', shortcut: 'ctrl+p'},
        {label: 'Edit', method: 'edit', icon: 'edit', group: 'basic', shortcut: 'ctrl+e'},
        {label: 'View', method: 'view', icon: 'visibility', group: 'basic'},
    ]
}

class Embedded_DocumentView extends oo.UIEntity {


    static initClass(descriptor) {
        super.initClass(descriptor)
        let newdesc = {}
        let parentdesc = this.__description__;
        newdesc.name = descriptor.name;
        newdesc.filename = descriptor.filename;
        newdesc.actions = parentdesc.actions? parentdesc.actions.slice() : []
        if (descriptor.actions) {
            for (let i = 0; i < descriptor.actions.length; i++) newdesc.actions.push(descriptor.actions[i])
        }
        this.__description__ = newdesc;
        return this;
    }

    constructor() {
        super()
        this.__record__ = null
    }

    open() {
        Embedded_DocumentView.emit('open', {documentView: this})
    }

    setFocus() {
        this.emit("focus", {documentView: this})
    }

    setRecord(record) {
        this.__record__ = record;
    }

    getRecord() {
        return this.__record__
    }


    edit() {
        this.emit('edit', {documentView: this})
    }


    view() {
        this.emit('view', {documentView: this})
    }


}

module.exports = Embedded_DocumentView.initClass(Description)