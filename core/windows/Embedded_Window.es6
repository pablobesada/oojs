"use strict";

var oo = require("openorange")
var _ = require("underscore")

var WindowDescription = {
    name: 'Embedded_Window',
    inherits: null,
    actions: [],
    filename: __filename,
}

class Embedded_Window {
    static new() {
        var res = new this()
        return res;
    }

    open() {
        var wm = Object.create(oo.windowmanager).init(this)
        wm.render($('#content')[0])
    }

    setFocus() {
        oo.windowmanager.setFocus(this)
    }

    static initClass(descriptor) {
        //var childclass = Object.create(this)
        let parentdesc = this.__description__;
        let newdesc = {};
        newdesc.name = descriptor.name;
        newdesc.title = descriptor.title;
        newdesc.recordClass = descriptor.record
        newdesc.form = descriptor.form || parentdesc.form;
        if (descriptor.override) {
            newdesc.form = this.applyFormOverride(newdesc.form, descriptor.override)
        }
        newdesc.actions = parentdesc.actions
        if (descriptor.actions) {
            for (let i=0;i<descriptor.actions.length;i++) newdesc.actions.push(descriptor.actions[i])
        }
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

    async call_action(methodname) {
        if (this[methodname]) return this[methodname]();
        console.log(`action ${methodname} not found in window`)
    }

    async save() {
        var rec = this.getRecord();
        if (rec != null) return rec.save();
        return false;
    }

    static applyFormOverride(form, patcheslist, path) {
        let findNodePath = function findNodePath(json, name, path) {
            if (json instanceof Array) {
                for (let i=0;i<json.length;i++) {
                    path.push(i)
                    let res = findNodePath(json[i], name, path)
                    if (res) return true;
                    path.pop()
                }
            }
            console.log(json)
            if (json.name == name) {
                return true;
            }
            let attr = 'content' in json? 'content': 'columns' in json? 'columns' : 'pages' in json? 'pages' : null
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
                let action = 'addafter' in patch? 'addafter' : 'addbefore' in patch? 'addbefore' : 'replace' in patch? 'replace' : 'remove';
                let nodepath = []
                let res = findNodePath(form, patch[action], nodepath);
                if (res) {
                    let nodeidx = nodepath.pop();
                    let parentnode = form;
                    for (let j=0;j<nodepath.length;j++) parentnode = parentnode[nodepath[j]];
                    switch (action) {
                        case 'addafter':
                            parentnode.splice(nodeidx+1, 0, patch.content);
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

Embedded_Window.__description__ = WindowDescription

module.exports = Embedded_Window
