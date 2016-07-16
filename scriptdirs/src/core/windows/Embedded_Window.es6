"use strict";

var oo = require("openorange")
var cm = oo.classmanager
var _ = require("underscore")

var WindowDescription = {
    name: 'Embedded_Window',
    inherits: "BaseEntity",
    actions: [],
    form: {},
    filename: __filename,
}

class Embedded_Window extends oo.UIEntity {

    async print() {
        let record = this.getRecord();
        if (record) {
            let document = await record.getDocument();
            if (document) document.open();
        }
    }

    open() {
        if (this.isOpen()) return;
        Embedded_Window.emit("open", {window: this})
        this.__isopen__ = true;
        if (this.getRecord() && this.getRecord().internalId) Embedded_Window.emit(`start editing record ${this.getRecord().__class__.getDescription().name}:${this.getRecord().internalId}`, {record: this.getRecord()})
        if (this.getRecord()) this.afterShowRecord();
    }

    isOpen() {
        return this.__isopen__;
    }

    close() {
        this.setRecord(null); //para que desconecten todos los eventos del record actual
        this.emit("close", {window:this})
        this.__isopen__ = false;
    }

    setFocus() {
        this.emit('focus', {window: this})
    }

    static initClass(descriptor) {
        super.initClass(descriptor)
        let parentdesc = this.__description__;
        let newdesc = {};
        newdesc.name = descriptor.name;
        newdesc.title = descriptor.title;
        newdesc.recordClass = descriptor.record
        newdesc.form = descriptor.form || parentdesc.form;
        if (descriptor.override) {
            newdesc.form = this.applyFormOverride(newdesc.form, descriptor.override)
        }
        newdesc.actions = parentdesc.actions? parentdesc.actions.slice() : []
        if (descriptor.actions) {
            for (let i = 0; i < descriptor.actions.length; i++) newdesc.actions.push(descriptor.actions[i])
        }
        newdesc.filename = descriptor.filename;
        this.__description__ = newdesc;
        this.__recordClass__ = null;
        return this;
    }

    static createFromDescription(description) {
        let res = super.createFromDescription(description);
        res.__class__.__recordClass__ = description.__recordClass__
        return res;
    }

    constructor() {
        super()
        this.__record__ = null;
        this.__title__ = this.__class__.__description__.title;
        this.__isopen__ = false;
        this.fieldModified = this.fieldModified.bind(this)
        this.detailCleared = this.detailCleared.bind(this)
        this.rowInserted = this.rowInserted.bind(this)
        this.rowRemoved = this.rowRemoved.bind(this)
        this.recordModifiedFlagChanged = this.recordModifiedFlagChanged.bind(this)
    }

    getRecordClass() {
        if (this.__class__.__recordClass__ == null && this.__class__.__description__.recordClass) {
            this.__class__.__recordClass__ = oo.classmanager.getClass(this.__class__.__description__.recordClass)
        }
        return this.__class__.__recordClass__
    }

    /*
    static tryCall(self, defaultResponse, methodname) {
        if (methodname == null) throw new Error("methodname can not be null")
        if (methodname in this.prototype) {
            return this.prototype[methodname].apply(self, Array.prototype.slice.apply(arguments).slice(2));
        } else {
            return defaultResponse;
        }
    }*/

    inspect() {
        return "<" + this.__class__.__description__.name + ", from " + this.__class__.__description__.filename + ">"
    }

    getOriginalTitle() {
        return this.__class__.__description__.title
    }

    getTitle() {
        return this.getOriginalTitle();
    }

    notifyTitleChanged() {
        this.emit('title changed', {title: this.getTitle()})
    }

    setTitle(title) {
        this.__title__ = title;
        this.emit('title changed', {title: title})
    }

    setRecord(rec) {
        if (this.__record__ != rec) {
            if (this.__record__ != null) {
                this.__record__.off('field modified', this.fieldModified);
                this.__record__.off('detail cleared', this.detailCleared);
                this.__record__.off('row inserted', this.rowInserted)
                this.__record__.off('row removed', this.rowRemoved)
                this.__record__.off('modified flag', this.recordModifiedFlagChanged)
            }
            this.__record__ = rec;
            if (this.__record__) {
                //this.__record__.addListener(this)
                this.__record__.on('field modified', this.fieldModified)
                this.__record__.on('detail cleared', this.detailCleared)
                this.__record__.on('row inserted', this.rowInserted)
                this.__record__.on('row removed', this.rowRemoved)
                this.__record__.on('modified flag', this.recordModifiedFlagChanged)
            }
            this.emit('record replaced', {record: rec})
            if (this.__record__ && this.isOpen()) this.afterShowRecord();
            if (this.__record__ && this.isOpen() && rec && rec.internalId) Embedded_Window.emit(`start editing record ${rec.__class__.getDescription().name}:${rec.internalId}`, {record: rec})
        }
    }

    fieldModified(event) {
        this.emit('field modified', {
            record: event.record,
            field: event.field,
            row: event.row,
            rowfield: event.rowfield,
            oldvalue: event.oldvalue
        })
    }

    rowInserted(event) {
        this.emit('row inserted', {
                record: event.record,
                detail: event.detail,
                row: event.row,
                position: event.position
        })
    }

    rowRemoved(event) {
        this.emit('row removed', {
            record: event.record,
            detail: event.detail,
            position: event.position
        })
    }

    detailCleared(event) {
        this.emit('detail cleared', {
            record: event.record,
            detail: event.detail,
        })
    }

    recordModifiedFlagChanged(event) {
        this.emit('modified flag', {
            record: event.record,
            modified: event.modified,
        })
    }

    getRecord(rec) {
        return this.__record__
    }

    async afterShowRecord() {

    }

    getReportView(viewname) {
        return {viewname: viewname, window: this}
    }

    beforeEdit(fieldname) {
        var self = this;
        var res = true;
        if ('focus ' + fieldname in self) {
            res = self['focus ' + fieldname]()
            return res;
        }
        res = self.getRecord().fieldIsEditable(fieldname);
        return res;
    }

    beforeEditRow(fieldname, rowfieldname, rownr) {
        var self = this;
        var res = true;
        if ('focus ' + fieldname + "." + rowfieldname in self) {
            res = self['focus ' + fieldname + "." + rowfieldname]()
            return res;
        }
        res = self.getRecord().fieldIsEditable(fieldname, rowfieldname, rownr);
        return res;
    }

    async call_afterEdit(fieldname, value) {
        var self = this;
        self.getRecord()[fieldname] = value;
        if ('changed ' + fieldname in self) {
            return await this['changed ' + fieldname]()
        }
    }

    async afterEditRow(fieldname, rowfieldname, rownr, value) {
        var self = this;
        self.getRecord()[fieldname][rownr][rowfieldname] = value;
        if ('changed ' + fieldname + '.' + rowfieldname in this) {
            this['changed ' + fieldname + '.' + rowfieldname](rownr)
        }
    }

    async callAction(actiondef) {
        if (this[actiondef.method]) return this[actiondef.method]();
    }

    async save() {
        var rec = this.getRecord();
        if (rec != null) {
            let res = await oo.beginTransaction()
            if (!res) return res;
            res = await rec.save();
            if (!res) return res;
            res = oo.commit()
            return res;
        }
        return false;
    }

    getCard(cardname) {
        let card = cm.getClass(cardname).new(this)
        let card_description = card.__class__.getDescription();
        let params = {}
        for (p in card_description.params) {
            if (this.getRecord() instanceof card_description.params[p]) {
                card.setParam(p,this.getRecord())
                this.on('record replaced', function (event) {
                    card.setParam(p,event.record);
                })
            }
        }
        return card
    }

    static applyFormOverride(form, patcheslist, path) {
        let findNodePath = function findNodePath(json, name, path) {
            if (json instanceof Array) {
                for (let i = 0; i < json.length; i++) {
                    path.push(i)
                    let res = findNodePath(json[i], name, path)
                    if (res) return true;
                    path.pop()
                }
            }
            if (json.name == name) {
                return true;
            }
            let attr = 'content' in json ? 'content' : 'columns' in json ? 'columns' : 'pages' in json ? 'pages' : null
            if (attr) {
                path.push(attr)
                let res = findNodePath(json[attr], name, path)
                if (res) return true;
                path.pop()
            }
            return false;
        }

        let newform = form;
        for (let i in patcheslist) {
            let patch = patcheslist[i];
            if ('addafter' in patch || 'addbefore' in patch || 'replace' in patch || 'remove' in patch) {
                let action = 'addafter' in patch ? 'addafter' : 'addbefore' in patch ? 'addbefore' : 'replace' in patch ? 'replace' : 'remove';
                let nodepath = []
                let res = findNodePath(form, patch[action], nodepath);
                if (res) {
                    let nodeidx = nodepath.pop();
                    let parentnode = form;
                    for (let j = 0; j < nodepath.length; j++) parentnode = parentnode[nodepath[j]];
                    switch (action) {
                        case 'addafter':
                            parentnode.splice(nodeidx + 1, 0, patch.content);
                            break;
                        case 'addbefore':
                            parentnode.splice(nodeidx, 0, patch.content);
                            break;
                        case 'replace':
                            parentnode.splice(nodeidx, 1, patch.content);
                            break;
                        case 'remove':
                            parentnode.splice(nodeidx, 1);
                            break;
                    }
                }
            } else if ('add') {
                form.push(patch.add)
            } else {
                throw new Error("Form override error. Wrong action. Needs to be addbefore, addafter, replace, add or remove.")
            }
        }
        return newform
    }
}

//Embedded_Window.__description__ = WindowDescription
module.exports = Embedded_Window.initClass(WindowDescription)
