"use strict";
var oo = require.main.require("./openorange")
var _ = require("underscore")

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
    //console.log("en get value: " + this.value)
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
    this.detailfield = null;
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

RowList.newRow = function newRow() {
    return this.detailfield.newRow();
}

var DetailField = Object.create(Array.prototype);
DetailField.init = function(name, description, listener) {
    this.name = name;
    this.__description__ = description;
    this.__rowclass__ = null;
    this.__removed_rows__ = [];
    //this.rows = Object.create(RowList).init();
    //this.rows.parent = listener;
    //this.rows.detailfield = this;
    this.listener = listener;
    return this;
}

DetailField.getRowClass = function getRowClass() {
    if (this.__rowclass__ == null) this.__rowclass__ = oo.classmanager.getClass(this.__description__.class);
    return this.__rowclass__;
}

DetailField.fieldNames = function fieldNames() {
    return this.getRowClass().fieldNames();
}
DetailField.newRow = function newRow() {
    return this.getRowClass().new();
}

DetailField.push = function push(obj) {
    obj.rowNr = this.length;
    Array.prototype.push.call(this, obj)
    obj.addListener(this);
    if (this.listener) this.listener.fieldModified(this);
}

DetailField.splice = function splice() {
    var self = this;
    var removed = Array.prototype.splice.apply(this, arguments)
    removed.forEach(function (element) {self.__removed_rows__.push(element)});
    if (removed.length >0) {
        for (var i=removed[0].rowNr; i<self.length; i++) {
            self[i].rowNr = i;
        }
        if (this.listener) this.listener.fieldModified(this);
    }
    return removed;
}

DetailField.fieldModified = function fieldModified(field) {
    if (this.listener) this.listener.fieldModified(this)
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
    name: 'Embedded_Record',
    inherits: null,
    fields: {
        internalId: {type: "integer"},
    },
    fieldnames: ['internalId'],
    detailnames: []
}

var Embedded_Record = Object.create({
    '__super__': null,
    '__description__': RecordDescription,
    '__filename__': __filename,
})

Embedded_Record.new = function () {
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
        return this.__details__[fn]
    }
}

Embedded_Record.createChildClass = function createChildClass(descriptor, filename) {
    var childclass = Object.create(this)
    childclass.__description__ = {fields: {}}
    for (var fn in this.__description__.fields) {
        childclass.__description__.fields[fn] = this.__description__.fields[fn];
    }
    for (var fn in descriptor.fields) {
        childclass.__description__.fields[fn] = descriptor.fields[fn];
    }
    childclass.__description__.name = descriptor.name;
    childclass.__description__.fieldnames = _(Object.keys(childclass.__description__.fields)).filter(function (fn) {return childclass.__description__.fields[fn].type != 'detail'})
    childclass.__description__.detailnames = _(Object.keys(childclass.__description__.fields)).filter(function (fn) {return childclass.__description__.fields[fn].type == 'detail'})
    childclass.__filename__ = filename;
    childclass.__super__ = this;
    return childclass;
}

Embedded_Record.init = function init() {
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
            this.__details__[fn] = Object.create(DetailField).init(fn, fd, this.__fieldslistener__);
            props[fn] = {
                enumerable: true,
                get: propDetailGetter(fn),
            }
        }
    }
    Object.defineProperties(this, props)
    return this;
}

Embedded_Record.fieldModified = function(field) {
    this.setModifiedFlag(true);
    for (var i=0;i<this.__listeners__.length;i++) {
        this.__listeners__[i].fieldModified(field);
    }
}

Embedded_Record.addListener = function (listener) {
    this.__listeners__.push(listener);
}

Embedded_Record.fieldNames = function fieldNames() {return this.__description__.fieldnames}
Embedded_Record.detailNames = function detailNames() {return this.__description__.detailnames}
Embedded_Record.fields = function fields(fn) {return this.__fields__[fn]}
Embedded_Record.details = function details(dn) {return this.__details__[dn]}
Embedded_Record.hasField = function hasField(fn) {return fn in this.__fields__}
Embedded_Record.inspect = function inspect() {
    return "<" + this.__description__.name + ", from " + this.__filename__+ ">"
}

Embedded_Record.__clearRemovedRows__ = function __clearRemovedRows__() {
    _(this.__details__).map(function (detail) { console.log(arguments); console.log("CL: " + detail.__removed_rows__.length); detail._removed_rows__ = []})
}
Embedded_Record.save = function save(callback) {
    oo.orm.save(this, callback);
}

Embedded_Record.delete = function save(callback) {
    oo.orm.delete(this, callback);
}


Embedded_Record.load = function load(callback) {
    oo.orm.load(this, callback);
}

Embedded_Record.isNew = function isNew() {
    return this.__isnew__;
}

Embedded_Record.setNewFlag = function setNewFlag(b) {
    return this.__isnew__ = b;
}

Embedded_Record.isModified = function isModified() {
    return this.__ismodified__;
}

Embedded_Record.setModifiedFlag = function setModifiedFlag(b) {
    this.__ismodified__ = b;
}

Embedded_Record.setNewFlag = function setNewFlag(b) {
    return this.__isnew__ = b;
}

Embedded_Record.toJSON = function toJSON() {
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

Embedded_Record.fromJSON = function fromJSON(obj, rec) {
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

module.exports = Embedded_Record
