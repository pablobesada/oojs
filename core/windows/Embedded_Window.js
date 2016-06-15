"use strict";
var oo = require("openorange")

var WindowDescription = {
    name: 'Embedded_Window',
    inherits: null,
}

var Embedded_Window = Object.create({
    '__super__': null,
    '__description__': WindowDescription,
    '__filename__': __filename,
})

Embedded_Window.new = function () {
    var res = Object.create(this);
    res.__class__ = this;
    return res.init();
}

Embedded_Window.open = function () {
    var wm = Object.create(window.WindowManager).init(this)
    wm.render($('#content')[0])
}

Embedded_Window.setFocus = function setFocus() {
    window.WindowManager.setFocus(this)
}

Embedded_Window.createChildClass = function createChildClass(descriptor, filename) {
    var childclass = Object.create(this)
    childclass.__description__ = {}
    childclass.__description__.name = descriptor.name;
    childclass.__description__.title = descriptor.title;
    childclass.__description__.recordClass = descriptor.record
    childclass.__description__.form = descriptor.form;
    childclass.__filename__ = filename;
    childclass.__super__ = this;
    this.__recordClass__ = null;
    return childclass;
}

Embedded_Window.init = function init() {
    this.__record__ = null;
    this.__listeners__ = []
    this.__title__ = this.__class__.__description__.title;
    return this;
}

Embedded_Window.addListener = function addListener(listener) {
    this.__listeners__.push(listener)
}

Embedded_Window.notifyListeners = function notifyListeners(event) {
    _(this.__listeners__).forEach(function (listener) {
        listener.update(event);
    })
}

Embedded_Window.getRecordClass = function getRecordClass() {
    if (this.__class__.__recordClass__ == null && this.__description__.recordClass) {
        this.__class__.__recordClass__ = oo.classmanager.getClass(this.__description__.recordClass)
    }
    return this.__class__.__recordClass__
}

Embedded_Window.super = function callSuper(methodname, self) {
    if (methodname in this.__super__) {
        return this.__super__[methodname].apply(self, Array.prototype.slice.apply(arguments).slice(2));
    } else {
        return Promise.resolve()
    }
}

Embedded_Window.getDescription = function getDescription() {
    return this.__description__
}

Embedded_Window.inspect = function inspect() {
    return "<" + this.__description__.name + ", from " + this.__filename__+ ">"
}

Embedded_Window.getOriginalTitle = function getOriginalTitle() {
    return this.__class__.__description__.title
}

Embedded_Window.getTitle = function getTitle() {
    return this.getOriginalTitle();
}

Embedded_Window.notifyTitleChanged = function notifyTitleChanged() {
    this.notifyListeners({type: "title", action: "modified", data: this.getTitle()})
}

Embedded_Window.setTitle = function setTitle(title) {
    this.__title__ = title;
    this.notifyListeners({type:"title", action: "modified", data: title})
}

Embedded_Window.save = function save() {
    if (this.getRecord() != null) {
        return this.getRecord().save();
    }
    return Promise.resolve()
}

Embedded_Window.setRecord = function setRecord(rec) {
    if (this.__record__ != rec) {
        this.__record__ = rec;
        this.__record__.addListener(this)
        this.notifyListeners({type: 'record', action: 'replaced', data: rec});
    }
}

Embedded_Window.fieldModified = function fieldModified(record, field, row, rowfield, oldvalue) {
    this.notifyListeners({type: 'field', action: 'modified', data: {
        record: record,
        field: field,
        row: row,
        rowfield: rowfield,
        oldvalue: oldvalue
    }})
}

Embedded_Window.rowInserted = function rowInserted(record, detail, row, position) {
    this.notifyListeners({type: 'field', action: 'row inserted', data: {
        record: record,
        detail: detail,
        row: row,
        position: position
    }})
}

Embedded_Window.detailCleared = function detailCleared(record, detail, row, position) {
    this.notifyListeners({type: 'field', action: 'detail cleared', data: {
        record: record,
        detail: detail,
    }})
}

Embedded_Window.getRecord = function getRecord(rec) {
    return this.__record__
}

Embedded_Window.beforeEdit = function beforeEdit(fieldname) {
    var self = this;
    var res=true;
    if ('focus ' + fieldname in self) {
        res = self['focus ' + fieldname]()
        return res;
    }
    res = self.getRecord().fieldIsEditable(fieldname);
    return res;
}

Embedded_Window.beforeEditRow = function beforeEditRow(fieldname, rowfieldname, rownr) {
    var self = this;
    var res = true;
    if ('focus ' + fieldname + "." + rowfieldname in self) {
        res = self['focus ' + fieldname + "." + rowfieldname]()
        return res;
    }
    res = self.getRecord().fieldIsEditable(fieldname, rowfieldname, rownr);
    return res;
}

Embedded_Window.afterEdit = function afterEdit(fieldname, value) {
    var self = this;
    self.getRecord()[fieldname] = value;
    if ('changed ' + fieldname in this) {
        this['changed ' + fieldname]()
    }
}

Embedded_Window.afterEditRow = function afterEditRow(fieldname, rowfieldname, rownr, value) {
    var self = this;
    self.getRecord()[fieldname][rownr][rowfieldname] = value;
    if ('changed ' + fieldname + '.' + rowfieldname in this) {
        this['changed ' + fieldname + '.' + rowfieldname](rownr)
    }
}

Embedded_Window.save = function save() {
    var rec = this.getRecord();
    if (rec != null) return rec.save();
}

module.exports = Embedded_Window
