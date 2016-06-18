"use strict";
var oo = require("openorange")
var _ = require("underscore")
var moment = require("momentjs")
var Query = oo.query;

//var Field = Object.create(null);
class Field {

    static create(name, type, length, persistent, linkto) {
        if (type == 'date') return new DateField(name, type, length, persistent, linkto);
        if (type == 'time') return new TimeField(name, type, length, persistent, linkto);
        return new Field(name, type, length, persistent, linkto);
    }

    constructor(name, type, length, persistent, linkto) {
        this.name = name;
        this.type = type;
        this.length = length;
        this.persistent = persistent;
        this.linkto = linkto;
        this.value = null;
        this.listener = null;
        return this;
    }

    getValue() {
        //console.log("en get value: " + this.value)
        return this.value;
    }

    getSQLValue() {
        //console.log("en get value: " + this.value)
        return this.value;
    }

    setValue(v) {
        if (this.value != v) {
            var oldvalue = this.value;
            this.value = v;
            if (this.listener) this.listener.fieldModified(this, oldvalue);
        }
    }

    toString(v) {
        return this.value != null ? this.value.toString() : null;
    }
}

//var DateField = Object.create(Field)
class DateField extends Field {
    constructor(name, type, length, persistent, linkto) {
        super(name, type, length, persistent, linkto)
    }

    setValue(v) {
        var vv;
        if (v == null) {
            vv = null;
        } else if (v instanceof moment) {
            vv = v
        } else if (v instanceof Date) {
            vv = moment(v)
        } else if (typeof v == 'string') {
            vv = moment(v, "YYYY-MM-DD")
        } else {
            vv = null
        }
        if (this.value != vv) {
            var oldvalue = this.value;
            this.value = vv;
            if (this.listener) this.listener.fieldModified(this, oldvalue);
        }
    }


    getSQLValue() {
        return this.value == null ? null : this.value.format("YYYY-MM-DD");
    }
}

//var TimeField = Object.create(Field)
class TimeField extends Field {
    constructor(name, type, length, persistent, linkto) {
        super(name, type, length, persistent, linkto)
    }

    setValue(v) {
        var vv;
        if (v == null) {
            vv = null;
        } else if (v instanceof moment) {
            vv = v.format("HH:mm:ss")
        } else if (typeof v == 'string') {
            vv = v
        } else {
            vv = null
        }
        if (this.value != vv) {
            var oldvalue = this.value;
            this.value = vv;
            if (this.listener) this.listener.fieldModified(this, oldvalue);
        }
    }

    getSQLValue() {
        return this.value == null ? null : this.value;
    }
}



var DetailField = Object.create(Array.prototype);
DetailField.init = function(name, description, listener) {
    this.name = name;
    this.__description__ = description;
    this.type = this.__description__.type
    this.__rowclass__ = null;
    this.__removed_rows__ = [];
    this.listener = listener;
    return this;
}

DetailField.getRowClass = function getRowClass() {
    if (this.__rowclass__ == null) this.__rowclass__ = oo.classmanager.getClass(this.__description__.class);
    return this.__rowclass__;
}

DetailField.clearRemovedRows = function clearRemovedRows() {
    this.__removed_rows__ = [];
}

DetailField.fieldNames = function fieldNames() {
    return this.getRowClass().__description__.fieldnames
}
DetailField.newRow = function newRow() {
    return this.getRowClass().new();
}

DetailField.push = function push(obj) {
    obj.rowNr = this.length;
    Array.prototype.push.call(this, obj)
    obj.addListener(this);
    if (this.listener) this.listener.rowInserted(this, obj, this.length-1);
}

DetailField.insert = function insert(obj, pos) {
    //return this.push(obj)
    obj.rowNr = pos;
    Array.prototype.splice.call(this, pos, 0, obj)
    for (var i=pos+1;i<this.length;i++) {
        this[i].rowNr = i;
    }
    obj.addListener(this);
    if (this.listener) this.listener.rowInserted(this, obj, pos);
}

DetailField.clear = function clear() {
    if (this.length != 0) {
        this.length = 0;
        if (this.listener) this.listener.detailCleared(this);
    }
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

DetailField.fieldModified = function fieldModified(record, field, oldvalue) {
    //[].unshift.call(arguments, this);
    if (this.listener) this.listener.fieldModified.call(this.listener, this, record, field, oldvalue)
}

var RecordListener = Object.create(null);
RecordListener.init = function (fieldModified) {
    this.fieldModified = fieldModified;
    return this;
}

var FieldsListener = Object.create(null);
FieldsListener.receiver = null;
FieldsListener.fieldModified = function () {
    if (this.receiver != null) this.receiver.fieldModified.apply(this.receiver, arguments);
}

FieldsListener.rowInserted = function (detail, row, position) {
    if (this.receiver != null) this.receiver.rowInserted(detail, row, position)
}

FieldsListener.detailCleared = function (detail, row, position) {
    if (this.receiver != null) this.receiver.detailCleared(detail)
}

var RecordDescription = {
    name: 'Embedded_Record',
    inherits: null,
    fields: {
        internalId: {type: "integer"},
    },
    fieldnames: ['internalId'],
    detailnames: [],
    filename: __filename
}

/*
var Embedded_Record = Object.create({
    '__super__': null,
    '__description__': RecordDescription,
    '__filename__': __filename,
})
*/

function propFieldGetter(fn) {
    return function () {
        //console.log("getting " + fn + " : " + this.__fields__[fn].getValue())
        return this.__fields__[fn].getValue()
    }
}

function propFieldSetter(fn) {
    return function (v) {
        //console.log("setting  "+  v + " in " + fn);
        return this.__fields__[fn].setValue(v);
    }
}

function propDetailGetter(fn) {
    return function () {
        //console.log("getting " + fn + " : " + this.__fields__[fn].getValue())
        return this.__details__[fn]
    }
}
class Embedded_Record {

    static new() {
        var res = new this()
        return res;
    }


    static initClass(descriptor) {
        //var childclass = Object.create(this)
        //console.log("en initClass: this.__description__: " + this.__description__)
        let parentdesc = this.__description__;
        let newdesc = {fields: {}, filename: descriptor.filename};
        for (var fn in parentdesc.fields) {
            newdesc.fields[fn] = parentdesc.fields[fn];
        }
        for (var fn in descriptor.fields) {
            newdesc.fields[fn] = descriptor.fields[fn];
        }
        newdesc.name = descriptor.name;
        newdesc.fieldnames = _(Object.keys(newdesc.fields)).filter(function (fn) {
            return newdesc.fields[fn].type != 'detail'
        })
        newdesc.detailnames = _(Object.keys(newdesc.fields)).filter(function (fn) {
            return newdesc.fields[fn].type == 'detail'
        })
        this.__super__ = Reflect.getPrototypeOf(this);
        this.__description__ = newdesc
        return this;
    }

    callSuper(methodname, self) {
        if (methodname in this.__super__) {
            return this.__super__[methodname].apply(self, Array.prototype.slice.apply(arguments).slice(2));
        } else {
            return Promise.resolve();
        }
    }

    static getDescription() {
        return this.__description__
    }

    constructor() {
        this.__class__ = this.constructor;
        this.__isnew__ = true;
        this.__ismodified__ = false;
        this.__fields__ = {}
        this.__oldfields__ = {}
        this.__details__ = {}
        this.__fieldslistener__ = Object.create(FieldsListener)
        this.__fieldslistener__.receiver = this;
        var props = {}
        this.__listeners__ = [];
        this.load = this.load.bind(this)
        this.store = this.store.bind(this)
        this.save = this.save.bind(this)
        this.delete = this.delete.bind(this)
        let description = this.__class__.getDescription()
        for (var fn in description.fields) {
            var fd = description.fields[fn]
            if (fd.type != 'detail') {
                this.__oldfields__[fn] = Field.create(fn, fd.type, fd.length, fd.persistent, fd.linkto);
                this.__fields__[fn] = Field.create(fn, fd.type, fd.length, fd.persistent, fd.linkto);
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

    fieldModified(p1, p2, p3, p4) { //it could be: {p1: field} or {p1: detail, p2: row, p3: rowfield, p4: oldvalue}
        this.setModifiedFlag(true);
        //[].unshift.call(arguments, this);
        for (var i = 0; i < this.__listeners__.length; i++) {
            this.__listeners__[i].fieldModified.call(this.__listeners__[i], this, p1, p2, p3, p4);
        }
    }

   rowInserted(detail, row, position) { //it could be: {p1: field} or {p1: detail, p2: row, p3: rowfield}
        this.setModifiedFlag(true);
        for (var i = 0; i < this.__listeners__.length; i++) {
            this.__listeners__[i].rowInserted(this, detail, row, position);
        }
    }

    detailCleared(detail) {  //{p1: detail}
        this.setModifiedFlag(true);
        for (var i = 0; i < this.__listeners__.length; i++) {
            this.__listeners__[i].detailCleared(this, detail);
        }
    }

    addListener(listener) {
        this.__listeners__.push(listener);
    }

    fieldNames() {
        return this.__class__.__description__.fieldnames
    }

    detailNames() {
        return this.__class__.__description__.detailnames
    }

    fields(fn) {
        return this.__fields__[fn]
    }

    oldFields(fn) {
        return this.__oldfields__[fn]
    }

    details(dn) {
        return this.__details__[dn]
    }

    hasField(fn) {
        return fn in this.__fields__
    }

    inspect() {
        return "<" + this.__class__.__description__.name + ", from " + this.__class__.__description__.filename + ">"
    }

    __clearRemovedRows__XXX() {
        _(this.__details__).map(function (detail) {
            detail._removed_rows__ = []
        })
    }

    async save() {
        let self = this;
        let was_new = null;
        let res = await self.check()
        if (!res) return res;
        if (self.isNew()) {
            was_new = true;
            res = await self.beforeInsert();
            if (!res) return res;
        } else {
            was_new = false;
            res = self.beforeUpdate();
            if (!res) return res;
        }
        res = await self.store();
        if (!res) return res;
        if (was_new) {
            self.afterInsert();
        } else {
            self.afterUpdate();
        }
        return true;
    }

    syncOldFields() {
        var self = this;
        _(this.__class__.__description__.fields).forEach(function (fdef, fn) {
            if (fdef.type != 'detail') {
                self.oldFields(fn).setValue(self[fn])
            } else {
                var detail = self[fn]
                for (var j = 0; j < detail.length; j++) {
                    detail[j].syncOldFields();
                }
                detail.clearRemovedRows();
            }
        })
        self.setModifiedFlag(false)
    }

    async defaults() {
        return Promise.resolve();
    }

    async check() {
        //return Promise.reject("check failed")
        return Promise.resolve();
    }

    async beforeInsert() {
        return Promise.resolve();
    }

    async beforeUpdate() {
        return Promise.resolve();
    }

    async afterInsert() {
        return Promise.resolve();
    }

    async afterUpdate() {
        return Promise.resolve();
    }

    async store() {
        var res = await oo.orm.store(this);
        return res
    }

    async delete() {
        return oo.orm.delete(this);
    }

    async load() {
        return oo.orm.load(this);
    }

    select() {
        return Query.select(this)
        //return oo.orm.select(this)
    }

    isNew() {
        return this.__isnew__;
    }

    isModified() {
        return this.__ismodified__;
    }

    setModifiedFlag(b) {
        this.__ismodified__ = b;
    }

    setNewFlag(b) {
        return this.__isnew__ = b;
    }

    toJSON() {
        var obj = {
            __meta__: {
                __isnew__: this.__isnew__,
                __ismodified__: this.__ismodified__,
                __classname__: this.__class__.__description__.name
            },
            fields: {},
            oldFields: {},
            removedRows: {}
        }
        var fieldnames = this.fieldNames();
        for (var i = 0; i < fieldnames.length; i++) {
            var fn = fieldnames[i];
            obj.fields[fn] = this.fields(fn).getSQLValue();
            obj.oldFields[fn] = this.oldFields(fn).getSQLValue();
        }
        var detailnames = this.detailNames();
        for (var i = 0; i < detailnames.length; i++) {
            var dn = detailnames[i];
            obj.fields[dn] = [];
            var detail = this[dn];
            for (var j = 0; j < detail.length; j++) {
                obj.fields[dn].push(this[dn][j].toJSON())
            }
            obj.removedRows[dn] = []
            for (var j = 0; j < detail.__removed_rows__.length; j++) {
                obj.removedRows[dn].push(detail.__removed_rows__[j].toJSON())
            }
        }
        return obj;
    }

    static fromJSON(obj, rec) {
        if (typeof obj == "string") obj = JSON.parse(obj);
        if (rec == null) rec = oo.classmanager.getClass(obj.__meta__.__classname__).new();
        var fieldnames = rec.fieldNames();
        for (var i = 0; i < fieldnames.length; i++) {
            var fn = fieldnames[i];
            rec[fn] = obj.fields[fn]
            rec.oldFields(fn).setValue(obj.oldFields[fn])
        }
        var detailnames = rec.detailNames();
        for (var i = 0; i < detailnames.length; i++) {
            var dn = detailnames[i];
            var detail = rec[dn];
            detail.clear();
            for (var j = 0; j < obj.fields[dn].length; j++) {
                detail.push(detail.getRowClass().fromJSON(obj.fields[dn][j]))
            }
            for (var j = 0; j < obj.removedRows[dn].length; j++) {
                detail.__removed_rows__.push(detail.getRowClass().fromJSON(obj.removedRows[dn][j]))
            }
        }
        rec.setNewFlag(obj.__meta__.__isnew__)
        rec.setModifiedFlag(obj.__meta__.__ismodified__)
        return rec;
    }

    clone() {
        var newrec = this.__class__.new();
        var fieldnames = this.fieldNames();
        for (var i = 0; i < fieldnames.length; i++) {
            var fn = fieldnames[i];
            newrec[fn] = this[fn]
        }
        var detailnames = this.detailNames();
        for (var i = 0; i < detailnames.length; i++) {
            var dn = detailnames[i];
            var newdetail = newrec[dn];
            var thisdetail = this[dn];
            newdetail.clear();
            for (var j = 0; j < this[dn].length; j++) {
                newdetail.push(thisdetail[j].clone())
            }
        }
        newrec.setNewFlag(this.isNew())
        newrec.setModifiedFlag(this.isModified())
        return newrec;
    }

    isEqual(rec) {
        if (rec.prototype != this.prototype) return false;
        var fieldnames = this.fieldNames();
        for (var i = 0; i < fieldnames.length; i++) {
            var fn = fieldnames[i];
            if (rec[fn] != this[fn]) return false;
        }
        var detailnames = this.detailNames();
        for (var i = 0; i < detailnames.length; i++) {
            var dn = detailnames[i];
            var recdetail = rec[dn];
            var thisdetail = this[dn];
            if (recdetail.length != thisdetail.length) return false;
            for (var j = 0; j < this[dn].length; j++) {
                if (!recdetail[j].isEqual(thisdetail[j])) return false;
            }
        }
        if (rec.isNew() != this.isNew()) return false;
        if (rec.isModified() != this.isModified()) return false;
        if (JSON.stringify(rec.toJSON()) != JSON.stringify(this.toJSON())) return false; //ojo con estoooooo es muy pesado me parece... y ademas es redundante, solo aporta la comparacion de oldfields y removedrows
        return true;
    }

    fieldIsEditable(fieldname, rowfieldname, rownr) {
        if (rowfieldname == 'rowNr') return false;
        return true;
    }
}
Embedded_Record.__description__ = RecordDescription
module.exports = Embedded_Record
