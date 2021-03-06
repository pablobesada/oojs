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
        if (!record) return;
        let docSpec = await record.getDocumentSpec()
        if (!docSpec) return;
        let docView = cm.getClass("Embedded_DocumentView").new()
        docView.setDocumentSpec(docSpec)
        docView.setRecord(record)
        docView.open();
        docView.setFocus()
        /*
        let record = this.getRecord();
        if (record) {
            let document = await record.getDocument();
            if (document) {
                document.open();
                document.setFocus();
            }
        }
        */
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
        this.emit("close", {window: this})
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
        newdesc.form = descriptor.form || this.__super__.__description__.form;
        if (descriptor.override) {
            newdesc.form = this.applyFormOverride(newdesc.form, descriptor.override)
        }
        newdesc.actions = parentdesc.actions
        newdesc.provides = parentdesc.provides ? parentdesc.provides.slice() : []
        if (descriptor.provides) {
            for (let i = 0; i < descriptor.provides.length; i++) newdesc.provides.push(descriptor.provides[i])
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
        this.setActionEnabled('save', false, false)
        this.setActionEnabled('delete', false, false)
    }

    static getRecordClass() {
        if (this.__recordClass__ == null && this.__description__.recordClass) {
            this.__recordClass__ = oo.classmanager.getClass(this.__description__.recordClass)
        }
        return this.__recordClass__
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
            this.setActionEnabled('save', false, false)
            this.setActionEnabled('delete', false, false)
            if (this.__record__ != null) {
                this.__record__.off('field modified', this.fieldModified);
                this.__record__.off('detail cleared', this.detailCleared);
                this.__record__.off('row inserted', this.rowInserted)
                this.__record__.off('row removed', this.rowRemoved)
                this.__record__.off('modified flag', this.recordModifiedFlagChanged)
                //this.__record__.off('saved', this.recordSaved)
            }
            this.__record__ = rec;
            if (this.__record__) {
                //this.__record__.addListener(this)
                this.__record__.on('field modified', this.fieldModified)
                this.__record__.on('detail cleared', this.detailCleared)
                this.__record__.on('row inserted', this.rowInserted)
                this.__record__.on('row removed', this.rowRemoved)
                this.__record__.on('modified flag', this.recordModifiedFlagChanged)
                //this.__record__.on('saved', this.recordSaved)
            }
            this.emit('record replaced', {record: rec})
            if (this.__record__) {
                this.setActionEnabled('save', this.__record__.isModified(), false)
                this.setActionEnabled('delete', !this.__record__.isNew(), true)
            }
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
        if (!event.modified) {
            this.setActionEnabled('delete', !event.record.isNew(), false)
            this.setActionEnabled('save', false, true)
        } else {
            this.setActionEnabled('save', true, true)
        }

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
        console.log(rownr, typeof rownr)
        if ('focus ' + fieldname + "." + rowfieldname in self) {

            res = self['focus ' + fieldname + "." + rowfieldname](rownr)
            return res;
        }
        res = self.getRecord().fieldIsEditable(fieldname, rowfieldname, rownr);
        return res;
    }

    async call_afterEdit(fieldname, value) {
        var self = this;
        self.getRecord()[fieldname] = value;
        if ('changed ' + fieldname in self) {
            let res =  await this['changed ' + fieldname]()
            return res;
        }
    }

    async call_afterEditRow(fieldname, rowfieldname, rownr, value) {
        var self = this;
        self.getRecord()[fieldname][rownr][rowfieldname] = value;
        if ('changed ' + fieldname + '.' + rowfieldname in this) {
            await this['changed ' + fieldname + '.' + rowfieldname](rownr)
        }
    }

    async deleteRow(fieldname, rownr) {
        let doit = await this.call_beforeDeleteRow(fieldname, rownr);
        if (doit) {
            console.log("rows length: " + this.getRecord().details(fieldname).length);
            console.log("deleteing row: " + rownr);
            this.getRecord().details(fieldname).remove(rownr)
            console.log("rows length2: " + this.getRecord().details(fieldname).length);
            let deletedRow = null //aca deberia venir la respuesta de Detail.remove(), pero creo que devuelve una lista y ademas oo en python no recibe este parametro asi que por ahora lo paso en null, cuando se necesite se activara
            await this.call_afterDeleteRow(fieldname, rownr, deletedRow);
        }
        return doit;
    }

    async call_beforeDeleteRow(fieldname, rownr) {
        return await this.beforeDeleteRow(fieldname, rownr)
    }

    async call_afterDeleteRow(fieldname, rownr) {
        await this.afterDeleteRow(fieldname, rownr)
    }

    async beforeDeleteRow(fieldname, rownr) {
        return true;
    }


    async afterDeleteRow(fieldname, rownr) {
    }

    async callAction(actiondef) {
        if (this[actiondef.method]) return this[actiondef.method]();
    }

    async save() {
        var rec = this.getRecord();
        if (rec != null) {
            this.emit('processing start', {window: this})
            try {
                let res = await oo.beginTransaction()
                if (!res) return res;
                res = await rec.save();
                if (res) {
                    res = await oo.commit()
                } else {
                    let errs = rec.getErrorResponses();
                    let focus_done = false;
                    for (let i = 0; i < errs.length; i++) {
                        let err = errs[i];
                        oo.postMessage(err.getMessage())
                        if (!focus_done && err.errorParams.FieldName) {
                            this.emit('focus field', {window: this, fieldname: err.errorParams.FieldName, rowfieldname: err.errorParams.RowFieldName, rownr: err.errorParams.RowNr})
                            focus_done = true;
                        }
                    }
                    rec.clearErrorResponses();
                }
                return res;
            } finally {
                this.emit('processing end', {window: this})
            }
        }
        return false;
    }

    async save() {
        var rec = this.getRecord();
        if (rec != null) {
            this.emit('processing start', {window: this})
            try {
                let res = rec.saveAndCommit();
                let errs = rec.getErrorResponses();
                let focus_done = false;
                for (let i = 0; i < errs.length; i++) {
                    let err = errs[i];
                    oo.postMessage(err.getMessage())
                    if (!focus_done && err.errorParams.FieldName) {
                        this.emit('focus field', {
                            window: this,
                            fieldname: err.errorParams.FieldName,
                            rowfieldname: err.errorParams.RowFieldName,
                            rownr: err.errorParams.RowNr
                        })
                        focus_done = true;
                    }
                }
                rec.clearErrorResponses();
                return res;
            } finally {
                this.emit('processing end', {window: this})
            }
        }
    }

    async delete() {
        if (!await oo.askYesNo("Seguro?")) return;
        var rec = this.getRecord();
        if (rec != null) {
            this.emit('processing start', {window: this})
            let res=null;
            try {
                res = rec.deleteAndCommit();
                let errs = rec.getErrorResponses();
                let focus_done = false;
                for (let i = 0; i < errs.length; i++) {
                    let err = errs[i];
                    oo.postMessage(err.getMessage())
                    if (!focus_done && err.errorParams.FieldName) {
                        this.emit('focus field', {
                            window: this,
                            fieldname: err.errorParams.FieldName,
                            rowfieldname: err.errorParams.RowFieldName,
                            rownr: err.errorParams.RowNr
                        })
                        focus_done = true;
                    }
                }
                rec.clearErrorResponses();
                return res;
            } finally {
                this.emit('processing end', {window: this})
                if (res) this.close();
            }
        }
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

    static findMatchingCardClasses() {
        return oo.classmanager.getClass("Embedded_Card").findMatchingCards(this.getProvidedDataTypes())
    }

    static getProvidedDataTypes() {
        let rc = this.getRecordClass()
        if (rc) {
            let res = rc.getProvidedDataTypes();
            return res
        }
        return {}
    }

    async getProvidedData() {
        if (!('__provided_data_object__' in this)) {
            let self = this;
            this.__provided_data_object__ = new oo.BaseEntity.ProvidedData()
            let r = this.getRecord();
            if (r) this.__provided_data_object__.setSource(await r.getProvidedData());
            this.on('record replaced', async (event) => {
                let r = this.getRecord();
                if (r) {
                    this.__provided_data_object__.setSource(await r.getProvidedData());
                } else {
                    self.__provided_data_object__.setSource(null)
                }
            })
        }
        //console.log("W: returning provided data")
        return this.__provided_data_object__
    }

    async getPasteWindowRecords(classname, start, count, text) {
        let q = oo.classmanager.getClass(classname).select();
        if (text) {
            let pwclass = oo.classmanager.getClass()
        }
        //if (this.where) q.where(this.where)
        q = q.offset(start).limit(count);
        return await q.fetch();
    }

}

//Embedded_Window.__description__ = WindowDescription
module.exports = Embedded_Window.initClass(WindowDescription)
