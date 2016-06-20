"use strict";
var oo = require("openorange")
var _ = require("underscore")

var WindowDescription = {
    name: 'Embedded_Window',
    inherits: null,
    filename: __filename,
}

class Embedded_Window {
    static new() {
        var res = new this()
        return res;
    }

    open() {
        var wm = Object.create(window.WindowManager).init(this)
        wm.render($('#content')[0])
    }

    setFocus() {
        window.WindowManager.setFocus(this)
    }

    static initClass(descriptor) {
        //var childclass = Object.create(this)
        let parentdesc = this.__description__;
        let newdesc = {};
        newdesc.name = descriptor.name;
        newdesc.title = descriptor.title;
        newdesc.recordClass = descriptor.record
        newdesc.form = descriptor.form;
        newdesc.filename = descriptor.filename;
        this.__description__ = newdesc;
        this.__recordClass__ = null;
        this.__super__ = Reflect.getPrototypeOf(this)
        return this;
    }

    constructor() {
        this.__class__ = this.constructor
        this.__record__ = null;
        this.__listeners__ = []
        this.__title__ = this.__class__.__description__.title;
    }

    addListener(listener) {
        this.__listeners__.push(listener)
    }

    notifyListeners(event) {
        _(this.__listeners__).forEach(function (listener) {
            listener.update(event);
        })
    }

    getRecordClass() {
        if (this.__class__.__recordClass__ == null && this.__class__.__description__.recordClass) {
            this.__class__.__recordClass__ = oo.classmanager.getClass(this.__class__.__description__.recordClass)
        }
        return this.__class__.__recordClass__
    }

    static tryCall(self, defaultResponse, methodname) {
        if (methodname == null) throw new Error("methodname can not be null")
        if (methodname in this.prototype) {
            return this.prototype[methodname].apply(self, Array.prototype.slice.apply(arguments).slice(2));
        } else {
            return defaultResponse;
        }
    }

    static getDescription() {
        return this.__description__
    }

    inspect() {
        return "<" + this.__description__.name + ", from " + this.__filename__ + ">"
    }

    getOriginalTitle() {
        return this.__class__.__description__.title
    }

    getTitle() {
        return this.getOriginalTitle();
    }

    notifyTitleChanged() {
        this.notifyListeners({type: "title", action: "modified", data: this.getTitle()})
    }

    setTitle(title) {
        this.__title__ = title;
        this.notifyListeners({type: "title", action: "modified", data: title})
    }

    setRecord(rec) {
        if (this.__record__ != rec) {
            this.__record__ = rec;
            this.__record__.addListener(this)
            this.notifyListeners({type: 'record', action: 'replaced', data: rec});
        }
    }

    fieldModified(record, field, row, rowfield, oldvalue) {
        this.notifyListeners({
            type: 'field', action: 'modified', data: {
                record: record,
                field: field,
                row: row,
                rowfield: rowfield,
                oldvalue: oldvalue
            }
        })
    }

    rowInserted(record, detail, row, position) {
        this.notifyListeners({
            type: 'field', action: 'row inserted', data: {
                record: record,
                detail: detail,
                row: row,
                position: position
            }
        })
    }

    detailCleared(record, detail, row, position) {
        this.notifyListeners({
            type: 'field', action: 'detail cleared', data: {
                record: record,
                detail: detail,
            }
        })
    }

    getRecord(rec) {
        return this.__record__
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
        //console.log(self.getRecord())
        self.getRecord()[fieldname] = value;
        //console.log(self.getRecord()[fieldname])
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

    async save() {
        var rec = this.getRecord();
        if (rec != null) return rec.save();
        return false;
    }
}

Embedded_Window.__description__ = WindowDescription

module.exports = Embedded_Window
