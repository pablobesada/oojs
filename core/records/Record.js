"use strict";
var oo = require.main.require("./openorange")

var Field = Object.create(null);
Field.init = function(name, type, length, persistent, linkto) {
    this.name = name;
    this.type = type;
    this.length = length;
    this.persistent = persistent;
    this.linkto = linkto;
    this.value = null;
    this.listener = null;
    return this;
}

Field.getValue = function () {
    return this.value;
}
Field.setValue = function (v) {
    if (this.value != v) {
        this.value = v;
        if (this.listener) this.listener.fieldModified(this);
    }
}
Field.toString = function (v) {
    return this.value != null? this.value.toString(): null;
}

var RowList = Object.create(Array.prototype);
RowList.init = function init() {
    this.listener = null
    return this;
}
RowList.push = function push(obj) {
    Array.prototype.push.call(this, obj)
    obj.addListener(this);
    if (this.listener) this.listener.fieldModified(this);
}
RowList.fieldModified = function fieldModified(field) {
    if (this.listener) this.listener.fieldModified(field)
}

var DetailField = Object.create(null);
DetailField.init = function(name, rowclassname, listener) {
    this.name = name;
    this.rowclassname = rowclassname;
    this.__rowclass__ = null;
    this.rows = Object.create(RowList).init();
    this.rows.listener = listener;
    this.listener = listener;
    return this;
}

DetailField.getValue = function () {
    return this.rows;
}
DetailField.getRowClass = function getRowClass() {
    if (this.__rowclass__ == null) this.__rowclass__ = oo.classmanager.getClass(this.rowclassname);
    return this.__rowclass__;
}
DetailField.newRow = function newRow() {
    return this.getRowClass().new();
}

var RecordListener = Object.create(null);
RecordListener.init = function (fieldModified) {
    this.fieldModified = fieldModified;
    return this;
}

var FieldsListener = Object.create(null);
FieldsListener.receiver = null;
FieldsListener.fieldModified = function (field) {
    if (this.receiver != null) this.receiver.fieldModified(field);
}

var RecordDescription = {
    name: 'Record',
    inherits: null,
    fields: {
        syncVersion: {type: "integer"},
        internalId: {type: "integer"},
    }
}

var Record = Object.create({
    '__super__': null,
    '__description__': RecordDescription,
    '__filename__': __filename,
})

Record.new = function () {
    return Object.create(this).init();
}

function propFieldGetter(fn)
{
    return function () {
        //console.log("getting " + fn + " : " + this.__fields__[fn].getValue())
        return this.__fields__[fn].getValue()
    }
}

function propFieldSetter(fn){
    return function (v) {
        //console.log("setting  "+  v + " in " + fn);
        return this.__fields__[fn].setValue(v);
    }
}

function propDetailGetter(fn)
{
    return function () {
        //console.log("getting " + fn + " : " + this.__fields__[fn].getValue())
        return this.__details__[fn].getValue()
    }
}

Record.createChildClass = function createChildClass(descriptor, filename) {
    var childclass = Object.create(this)
    childclass.__description__ = {fields: {}}
    for (var fn in this.__description__.fields) {
        childclass.__description__.fields[fn] = this.__description__.fields[fn];
    }
    for (var fn in descriptor.fields) {
        childclass.__description__.fields[fn] = descriptor.fields[fn];
    }
    childclass.__description__.name = descriptor.name;
    childclass.__filename__ = filename;
    childclass.__super__ = this;
    return childclass;
}

Record.init = function init() {
    this.__isnew__ = true;
    this.__ismodified__ = false;
    this.__fields__ = {}
    this.__details__ = {}
    this.__fieldslistener__ = Object.create(FieldsListener)
    this.__fieldslistener__.receiver = this;
    var props = {}
    this.__listeners__ = [];

    for (var fn in this.__description__.fields) {
        var fd = this.__description__.fields[fn]
        if (fd.type != 'detail') {
            this.__fields__[fn] = Object.create(Field).init(fn, fd.type, fd.length, fd.persistent, fd.linkto);
            this.__fields__[fn].listener = this.__fieldslistener__;
            props[fn] = {
                enumerable: true,
                get: propFieldGetter(fn),
                set: propFieldSetter(fn),
            }
        } else {
            this.__details__[fn] = Object.create(DetailField).init(fn, fd.class, this.__fieldslistener__);
            props[fn] = {
                enumerable: true,
                get: propDetailGetter(fn),
            }
        }
    }
    Object.defineProperties(this, props)
    return this;
}

Record.fieldModified = function(field) {
    this.setModifiedFlag(true);
    for (var i=0;i<this.__listeners__.length;i++) {
        this.__listeners__[i].fieldModified(field);
    }
}

Record.addListener = function (listener) {
    this.__listeners__.push(listener);
}

Record.fieldNames = function fieldNames() {return Object.keys(this.__fields__)}
Record.detailNames = function detailNames() {return Object.keys(this.__details__)}
Record.fields = function fields(fn) {return this.__fields__[fn]}
Record.details = function details(dn) {return this.__details__[dn]}

Record.inspect = function inspect() {
    return "<" + this.__description__.name + ", from " + this.__filename__+ ">"
}

Record.save = function save(callback) {
    oo.orm.save(this, callback);
}


Record.load = function load(callback) {
    oo.orm.load(this, callback);
}

Record.isNew = function isNew() {
    return this.__isnew__;
}

Record.setNewFlag = function setNewFlag(b) {
    return this.__isnew__ = b;
}

Record.isModified = function isModified() {
    return this.__ismodified__;
}

Record.setModifiedFlag = function setModifiedFlag(b) {
    this.__ismodified__ = b;
}

Record.setNewFlag = function setNewFlag(b) {
    return this.__isnew__ = b;
}

Record.toJSON = function toJSON() {
    var obj = {
        __classname__: this.__description__.name
    }
    var fieldnames = this.fieldNames();
    for (var i=0;i<fieldnames.length;i++) {
        var fn = fieldnames[i];
        obj[fn] = this[fn];
    }
    return obj;
}

Record.fromJSON = function fromJSON(obj, rec) {
    console.log("en fromJSON");
    if (typeof obj == "string") obj = JSON.parse(obj);
    if (rec == null) rec = oo.classmanager.getClass(obj.__classname__).new();
    var fieldnames = rec.fieldNames();
    for (var i=0;i<fieldnames.length;i++) {
        var fn = fieldnames[i];
        rec[fn] = obj[fn]
    }
    return rec;
}

module.exports = Record
