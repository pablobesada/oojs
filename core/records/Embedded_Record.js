"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var oo = require("openorange");
var _ = require("underscore");
var moment = require("momentjs");
var Query = oo.query;

//var Field = Object.create(null);

var Field = function () {
    _createClass(Field, null, [{
        key: "create",
        value: function create(name, type, length, persistent, linkto) {
            if (type == 'date') return new DateField(name, type, length, persistent, linkto);
            if (type == 'time') return new TimeField(name, type, length, persistent, linkto);
            return new Field(name, type, length, persistent, linkto);
        }
    }]);

    function Field(name, type, length, persistent, linkto) {
        _classCallCheck(this, Field);

        this.name = name;
        this.type = type;
        this.length = length;
        this.persistent = persistent;
        this.linkto = linkto;
        this.value = null;
        this.listener = null;
        return this;
    }

    _createClass(Field, [{
        key: "getValue",
        value: function getValue() {
            //console.log("en get value: " + this.value)
            return this.value;
        }
    }, {
        key: "getSQLValue",
        value: function getSQLValue() {
            //console.log("en get value: " + this.value)
            return this.value;
        }
    }, {
        key: "setValue",
        value: function setValue(v) {
            if (this.value != v) {
                var oldvalue = this.value;
                this.value = v;
                if (this.listener) this.listener.fieldModified(this, oldvalue);
            }
        }
    }, {
        key: "toString",
        value: function toString(v) {
            return this.value != null ? this.value.toString() : null;
        }
    }]);

    return Field;
}();

//var DateField = Object.create(Field)


var DateField = function (_Field) {
    _inherits(DateField, _Field);

    function DateField(name, type, length, persistent, linkto) {
        _classCallCheck(this, DateField);

        return _possibleConstructorReturn(this, Object.getPrototypeOf(DateField).call(this, name, type, length, persistent, linkto));
    }

    _createClass(DateField, [{
        key: "setValue",
        value: function setValue(v) {
            var vv;
            if (v == null) {
                vv = null;
            } else if (v instanceof moment) {
                vv = v;
            } else if (v instanceof Date) {
                vv = moment(v);
            } else if (typeof v == 'string') {
                vv = moment(v, "YYYY-MM-DD");
            } else {
                vv = null;
            }
            if (this.value != vv) {
                var oldvalue = this.value;
                this.value = vv;
                if (this.listener) this.listener.fieldModified(this, oldvalue);
            }
        }
    }, {
        key: "getSQLValue",
        value: function getSQLValue() {
            return this.value == null ? null : this.value.format("YYYY-MM-DD");
        }
    }]);

    return DateField;
}(Field);

//var TimeField = Object.create(Field)


var TimeField = function (_Field2) {
    _inherits(TimeField, _Field2);

    function TimeField(name, type, length, persistent, linkto) {
        _classCallCheck(this, TimeField);

        return _possibleConstructorReturn(this, Object.getPrototypeOf(TimeField).call(this, name, type, length, persistent, linkto));
    }

    _createClass(TimeField, [{
        key: "setValue",
        value: function setValue(v) {
            var vv;
            if (v == null) {
                vv = null;
            } else if (v instanceof moment) {
                vv = v.format("HH:mm:ss");
            } else if (typeof v == 'string') {
                vv = v;
            } else {
                vv = null;
            }
            if (this.value != vv) {
                var oldvalue = this.value;
                this.value = vv;
                if (this.listener) this.listener.fieldModified(this, oldvalue);
            }
        }
    }, {
        key: "getSQLValue",
        value: function getSQLValue() {
            return this.value == null ? null : this.value;
        }
    }]);

    return TimeField;
}(Field);

var DetailField = Object.create(Array.prototype);
DetailField.init = function (name, description, listener) {
    this.name = name;
    this.__description__ = description;
    this.type = this.__description__.type;
    this.__rowclass__ = null;
    this.__removed_rows__ = [];
    this.listener = listener;
    return this;
};

DetailField.getRowClass = function getRowClass() {
    if (this.__rowclass__ == null) this.__rowclass__ = oo.classmanager.getClass(this.__description__.class);
    return this.__rowclass__;
};

DetailField.clearRemovedRows = function clearRemovedRows() {
    this.__removed_rows__ = [];
};

DetailField.fieldNames = function fieldNames() {
    return this.getRowClass().fieldNames();
};
DetailField.newRow = function newRow() {
    return this.getRowClass().new();
};

DetailField.push = function push(obj) {
    obj.rowNr = this.length;
    Array.prototype.push.call(this, obj);
    obj.addListener(this);
    if (this.listener) this.listener.rowInserted(this, obj, this.length - 1);
};

DetailField.insert = function insert(obj, pos) {
    //return this.push(obj)
    obj.rowNr = pos;
    Array.prototype.splice.call(this, pos, 0, obj);
    for (var i = pos + 1; i < this.length; i++) {
        this[i].rowNr = i;
    }
    obj.addListener(this);
    if (this.listener) this.listener.rowInserted(this, obj, pos);
};

DetailField.clear = function clear() {
    if (this.length != 0) {
        this.length = 0;
        if (this.listener) this.listener.detailCleared(this);
    }
};

DetailField.splice = function splice() {
    var self = this;
    var removed = Array.prototype.splice.apply(this, arguments);
    removed.forEach(function (element) {
        self.__removed_rows__.push(element);
    });
    if (removed.length > 0) {
        for (var i = removed[0].rowNr; i < self.length; i++) {
            self[i].rowNr = i;
        }
        if (this.listener) this.listener.fieldModified(this);
    }
    return removed;
};

DetailField.fieldModified = function fieldModified(record, field, oldvalue) {
    //[].unshift.call(arguments, this);
    if (this.listener) this.listener.fieldModified.call(this.listener, this, record, field, oldvalue);
};

var RecordListener = Object.create(null);
RecordListener.init = function (fieldModified) {
    this.fieldModified = fieldModified;
    return this;
};

var FieldsListener = Object.create(null);
FieldsListener.receiver = null;
FieldsListener.fieldModified = function () {
    if (this.receiver != null) this.receiver.fieldModified.apply(this.receiver, arguments);
};

FieldsListener.rowInserted = function (detail, row, position) {
    if (this.receiver != null) this.receiver.rowInserted(detail, row, position);
};

FieldsListener.detailCleared = function (detail, row, position) {
    if (this.receiver != null) this.receiver.detailCleared(detail);
};

var RecordDescription = {
    name: 'Embedded_Record',
    inherits: null,
    fields: {
        internalId: { type: "integer" }
    },
    fieldnames: ['internalId'],
    detailnames: []
};

var Embedded_Record = Object.create({
    '__super__': null,
    '__description__': RecordDescription,
    '__filename__': __filename
});

Embedded_Record.new = function () {
    var res = Object.create(this);
    res.__class__ = this;
    return res.init();
};

function propFieldGetter(fn) {
    return function () {
        //console.log("getting " + fn + " : " + this.__fields__[fn].getValue())
        return this.__fields__[fn].getValue();
    };
}

function propFieldSetter(fn) {
    return function (v) {
        //console.log("setting  "+  v + " in " + fn);
        return this.__fields__[fn].setValue(v);
    };
}

function propDetailGetter(fn) {
    return function () {
        //console.log("getting " + fn + " : " + this.__fields__[fn].getValue())
        return this.__details__[fn];
    };
}

Embedded_Record.createChildClass = function createChildClass(descriptor, filename) {
    var childclass = Object.create(this);
    childclass.__description__ = { fields: {} };
    for (var fn in this.__description__.fields) {
        childclass.__description__.fields[fn] = this.__description__.fields[fn];
    }
    for (var fn in descriptor.fields) {
        childclass.__description__.fields[fn] = descriptor.fields[fn];
    }
    childclass.__description__.name = descriptor.name;
    childclass.__description__.fieldnames = _(Object.keys(childclass.__description__.fields)).filter(function (fn) {
        return childclass.__description__.fields[fn].type != 'detail';
    });
    childclass.__description__.detailnames = _(Object.keys(childclass.__description__.fields)).filter(function (fn) {
        return childclass.__description__.fields[fn].type == 'detail';
    });
    childclass.__filename__ = filename;
    childclass.__super__ = this;
    return childclass;
};

Embedded_Record.super = function callSuper(methodname, self) {
    if (methodname in this.__super__) {
        return this.__super__[methodname].apply(self, Array.prototype.slice.apply(arguments).slice(2));
    } else {
        return Promise.resolve();
    }
};

Embedded_Record.getDescription = function getDescription() {
    return this.__description__;
};

Embedded_Record.init = function init() {
    this.__isnew__ = true;
    this.__ismodified__ = false;
    this.__fields__ = {};
    this.__oldfields__ = {};
    this.__details__ = {};
    this.__fieldslistener__ = Object.create(FieldsListener);
    this.__fieldslistener__.receiver = this;
    var props = {};
    this.__listeners__ = [];
    this.load = this.load.bind(this);
    this.store = this.store.bind(this);
    this.save = this.save.bind(this);
    this.delete = this.delete.bind(this);
    for (var fn in this.__description__.fields) {
        var fd = this.__description__.fields[fn];
        if (fd.type != 'detail') {
            this.__oldfields__[fn] = Field.create(fn, fd.type, fd.length, fd.persistent, fd.linkto);
            this.__fields__[fn] = Field.create(fn, fd.type, fd.length, fd.persistent, fd.linkto);
            this.__fields__[fn].listener = this.__fieldslistener__;
            props[fn] = {
                enumerable: true,
                get: propFieldGetter(fn),
                set: propFieldSetter(fn)
            };
        } else {
            this.__details__[fn] = Object.create(DetailField).init(fn, fd, this.__fieldslistener__);
            props[fn] = {
                enumerable: true,
                get: propDetailGetter(fn)
            };
        }
    }
    Object.defineProperties(this, props);
    return this;
};

Embedded_Record.fieldModified = function (p1, p2, p3, p4) {
    //it could be: {p1: field} or {p1: detail, p2: row, p3: rowfield, p4: oldvalue}
    this.setModifiedFlag(true);
    //[].unshift.call(arguments, this);
    for (var i = 0; i < this.__listeners__.length; i++) {
        this.__listeners__[i].fieldModified.call(this.__listeners__[i], this, p1, p2, p3, p4);
    }
};

Embedded_Record.rowInserted = function rowInserted(detail, row, position) {
    //it could be: {p1: field} or {p1: detail, p2: row, p3: rowfield}
    this.setModifiedFlag(true);
    for (var i = 0; i < this.__listeners__.length; i++) {
        this.__listeners__[i].rowInserted(this, detail, row, position);
    }
};

Embedded_Record.detailCleared = function detailCleared(detail) {
    //{p1: detail}
    this.setModifiedFlag(true);
    for (var i = 0; i < this.__listeners__.length; i++) {
        this.__listeners__[i].detailCleared(this, detail);
    }
};

Embedded_Record.addListener = function (listener) {
    this.__listeners__.push(listener);
};

Embedded_Record.fieldNames = function fieldNames() {
    return this.__description__.fieldnames;
};
Embedded_Record.detailNames = function detailNames() {
    return this.__description__.detailnames;
};
Embedded_Record.fields = function fields(fn) {
    return this.__fields__[fn];
};
Embedded_Record.oldFields = function oldFields(fn) {
    return this.__oldfields__[fn];
};
Embedded_Record.details = function details(dn) {
    return this.__details__[dn];
};
Embedded_Record.hasField = function hasField(fn) {
    return fn in this.__fields__;
};
Embedded_Record.inspect = function inspect() {
    return "<" + this.__description__.name + ", from " + this.__filename__ + ">";
};

Embedded_Record.__clearRemovedRows__XX = function __clearRemovedRows__() {
    _(this.__details__).map(function (detail) {
        detail._removed_rows__ = [];
    });
};

Embedded_Record.save = function () {
    var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
        var self, was_new, res;
        return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        self = this;
                        was_new = null;
                        _context.next = 4;
                        return self.check();

                    case 4:
                        res = _context.sent;

                        if (res) {
                            _context.next = 7;
                            break;
                        }

                        return _context.abrupt("return", res);

                    case 7:
                        if (!self.isNew()) {
                            _context.next = 16;
                            break;
                        }

                        was_new = true;
                        _context.next = 11;
                        return self.beforeInsert();

                    case 11:
                        res = _context.sent;

                        if (res) {
                            _context.next = 14;
                            break;
                        }

                        return _context.abrupt("return", res);

                    case 14:
                        _context.next = 20;
                        break;

                    case 16:
                        was_new = false;
                        res = self.beforeUpdate();

                        if (res) {
                            _context.next = 20;
                            break;
                        }

                        return _context.abrupt("return", res);

                    case 20:
                        _context.next = 22;
                        return self.store();

                    case 22:
                        res = _context.sent;

                        if (res) {
                            _context.next = 25;
                            break;
                        }

                        return _context.abrupt("return", res);

                    case 25:
                        if (was_new) {
                            self.afterInsert();
                        } else {
                            self.afterUpdate();
                        }
                        return _context.abrupt("return", true);

                    case 27:
                    case "end":
                        return _context.stop();
                }
            }
        }, _callee, this);
    }));

    function save() {
        return ref.apply(this, arguments);
    }

    return save;
}();

Embedded_Record.syncOldFields = function syncOldFields() {
    var self = this;
    var fields = this.__description__.fields;
    _(this.__description__.fields).forEach(function (fdef, fn) {
        if (fdef.type != 'detail') {
            self.oldFields(fn).setValue(self[fn]);
        } else {
            var detail = self[fn];
            for (var j = 0; j < detail.length; j++) {
                detail[j].syncOldFields();
            }
            detail.clearRemovedRows();
        }
    });
    self.setModifiedFlag(false);
};

Embedded_Record.defaults = function defaults() {
    return Promise.resolve();
};

Embedded_Record.check = function check() {
    //return Promise.reject("check failed")
    return Promise.resolve();
};

Embedded_Record.beforeInsert = function beforeInsert() {
    return Promise.resolve();
};

Embedded_Record.beforeUpdate = function beforeUpdate() {
    return Promise.resolve();
};

Embedded_Record.afterInsert = function afterInsert() {
    return Promise.resolve();
};

Embedded_Record.afterUpdate = function afterUpdate() {
    return Promise.resolve();
};

Embedded_Record.store = function () {
    var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee2() {
        var res;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
            while (1) {
                switch (_context2.prev = _context2.next) {
                    case 0:
                        _context2.next = 2;
                        return oo.orm.store(this);

                    case 2:
                        res = _context2.sent;
                        return _context2.abrupt("return", res);

                    case 4:
                    case "end":
                        return _context2.stop();
                }
            }
        }, _callee2, this);
    }));

    function store() {
        return ref.apply(this, arguments);
    }

    return store;
}();

Embedded_Record.delete = function del() {
    return oo.orm.delete(this);
};

Embedded_Record.load = function load() {
    return oo.orm.load(this);
};

Embedded_Record.select = function select() {
    return Query.select(this);
    //return oo.orm.select(this)
};

Embedded_Record.isNew = function isNew() {
    return this.__isnew__;
};

Embedded_Record.setNewFlag = function setNewFlag(b) {
    return this.__isnew__ = b;
};

Embedded_Record.isModified = function isModified() {
    return this.__ismodified__;
};

Embedded_Record.setModifiedFlag = function setModifiedFlag(b) {
    this.__ismodified__ = b;
};

Embedded_Record.setNewFlag = function setNewFlag(b) {
    return this.__isnew__ = b;
};

Embedded_Record.toJSON = function toJSON() {
    var obj = {
        __meta__: {
            __isnew__: this.__isnew__,
            __ismodified__: this.__ismodified__,
            __classname__: this.__description__.name
        },
        fields: {},
        oldFields: {},
        removedRows: {}
    };
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
            obj.fields[dn].push(this[dn][j].toJSON());
        }
        obj.removedRows[dn] = [];
        for (var j = 0; j < detail.__removed_rows__.length; j++) {
            obj.removedRows[dn].push(detail.__removed_rows__[j].toJSON());
        }
    }
    return obj;
};

Embedded_Record.fromJSON = function fromJSON(obj, rec) {
    if (typeof obj == "string") obj = JSON.parse(obj);
    if (rec == null) rec = oo.classmanager.getClass(obj.__meta__.__classname__).new();
    var fieldnames = rec.fieldNames();
    for (var i = 0; i < fieldnames.length; i++) {
        var fn = fieldnames[i];
        rec[fn] = obj.fields[fn];
        rec.oldFields(fn).setValue(obj.oldFields[fn]);
    }
    var detailnames = rec.detailNames();
    for (var i = 0; i < detailnames.length; i++) {
        var dn = detailnames[i];
        var detail = rec[dn];
        detail.clear();
        for (var j = 0; j < obj.fields[dn].length; j++) {
            detail.push(detail.getRowClass().fromJSON(obj.fields[dn][j]));
        }
        for (var j = 0; j < obj.removedRows[dn].length; j++) {
            detail.__removed_rows__.push(detail.getRowClass().fromJSON(obj.removedRows[dn][j]));
        }
    }
    rec.setNewFlag(obj.__meta__.__isnew__);
    rec.setModifiedFlag(obj.__meta__.__ismodified__);
    return rec;
};

Embedded_Record.clone = function clone() {
    var newrec = this.new();
    var fieldnames = this.fieldNames();
    for (var i = 0; i < fieldnames.length; i++) {
        var fn = fieldnames[i];
        newrec[fn] = this[fn];
    }
    var detailnames = this.detailNames();
    for (var i = 0; i < detailnames.length; i++) {
        var dn = detailnames[i];
        var newdetail = newrec[dn];
        var thisdetail = this[dn];
        newdetail.clear();
        for (var j = 0; j < this[dn].length; j++) {
            newdetail.push(thisdetail[j].clone());
        }
    }
    newrec.setNewFlag(this.isNew());
    newrec.setModifiedFlag(this.isModified());
    return newrec;
};

Embedded_Record.isEqual = function isEqual(rec) {
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
};

Embedded_Record.fieldIsEditable = function fieldIsEditable(fieldname, rowfieldname, rownr) {
    if (rowfieldname == 'rowNr') return false;
    return true;
};

module.exports = Embedded_Record;

//# sourceMappingURL=Embedded_Record.js.map