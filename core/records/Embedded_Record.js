"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

//"use strict";
var oo = require("openorange");
var _ = require("underscore");
var moment = require("moment");
var Query = oo.query;

//var Field = Object.create(null);

var Field = function () {
    _createClass(Field, null, [{
        key: "create",
        value: function create(name, type, length, persistent, linkto, setrecordname) {
            if (type == 'date') return new DateField(name, type, length, persistent, linkto);
            if (type == 'time') return new TimeField(name, type, length, persistent, linkto);
            return new Field(name, type, length, persistent, linkto, setrecordname);
        }
    }]);

    function Field(name, type, length, persistent, linkto, setrecordname) {
        _classCallCheck(this, Field);

        this.name = name;
        this.type = type;
        this.__length__ = length;
        this.persistent = persistent;
        this.linkto = linkto;
        this.setrecordname = setrecordname;
        this.__linkto_recordClass__ = null;
        this.value = null;
        this.listener = null;
    }

    _createClass(Field, [{
        key: "getValue",
        value: function getValue() {
            //console.log("en get value: " + this.value)
            return this.value;
        }
    }, {
        key: "getMaxLength",
        value: function getMaxLength() {
            if (this.__length__ != null && this.__length__ != undefined) return this.__length__;
            if (this.linkto) {
                var cls = this.getLinktoRecordClass();
                this.__length__ = cls.getDescription().fields[cls.uniqueKey()[0]].length;
            }
            return this.__length__;
        }
    }, {
        key: "getLinktoRecordClass",
        value: function getLinktoRecordClass() {
            if (!this.linkto) return null;
            if (!this.__linkto_recordClass__) {
                this.__linkto_recordClass__ = oo.classmanager.getClass(this.linkto);
            }
            return this.__linkto_recordClass__;
        }
    }, {
        key: "cloneValue",
        value: function cloneValue() {
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
            } else if (moment.isMoment(v)) {
                vv = moment([v.year(), v.month(), v.date()]);
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
        key: "cloneValue",
        value: function cloneValue() {
            return this.value == null ? null : this.value.clone();
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
        key: "cloneValue",
        value: function cloneValue() {
            return this.value == null ? null : this.value.clone();
        }
    }, {
        key: "getSQLValue",
        value: function getSQLValue() {
            return this.value == null ? null : this.value;
        }
    }]);

    return TimeField;
}(Field);

var DetailField = Object.create(Array.prototype); //class DetailField extends Array no funciona bien
DetailField.init = function init(name, description, listener) {
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
    return this.getRowClass().__description__.fieldnames;
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
    detailnames: [],
    filename: __filename
};

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

var Embedded_Record = function () {
    _createClass(Embedded_Record, [{
        key: "callSuperXXX",
        value: function callSuperXXX(methodname, self) {
            if (methodname in this.__super__) {
                return this.__super__[methodname].apply(self, Array.prototype.slice.apply(arguments).slice(2));
            } else {
                return Promise.resolve();
            }
        }
    }], [{
        key: "new",
        value: function _new() {
            var res = new this();
            return res;
        }
    }, {
        key: "initClass",
        value: function initClass(descriptor) {
            //var childclass = Object.create(this)
            //console.log("en initClass: this.__description__: " + this.__description__)
            var parentdesc = this.__description__;
            var newdesc = { fields: {}, filename: descriptor.filename };
            for (var fn in parentdesc.fields) {
                newdesc.fields[fn] = parentdesc.fields[fn];
            }
            for (var fn in descriptor.fields) {
                var fdef = descriptor.fields[fn];
                newdesc.fields[fn] = fdef;
                if (fdef.type == 'string' && fdef.linkto) newdesc.fields[fn].length = null;
            }
            newdesc.name = descriptor.name;
            newdesc.persistent = 'persistent' in descriptor ? descriptor.persistent : true;

            newdesc.fieldnames = _(Object.keys(newdesc.fields)).filter(function (fn) {
                return newdesc.fields[fn].type != 'detail';
            });
            newdesc.persistentFieldNames = _(newdesc.fieldnames).filter(function (fn) {
                return 'persistent' in newdesc.fields[fn] ? newdesc.fields[fn].persistent : true;
            });

            newdesc.detailnames = _(Object.keys(newdesc.fields)).filter(function (fn) {
                return newdesc.fields[fn].type == 'detail';
            });
            newdesc.persistentDetailNames = _(newdesc.detailnames).filter(function (fn) {
                return 'persistent' in newdesc.fields[fn] ? newdesc.fields[fn].persistent : true;
            });

            this.__super__ = Reflect.getPrototypeOf(this);
            this.__description__ = newdesc;
            return this;
        }
    }, {
        key: "tryCall",
        value: function tryCall(self, defaultResponse, methodname) {
            if (methodname == null) throw new Error("methodname can not be null");
            if (methodname in this.prototype) {
                return this.prototype[methodname].apply(self, Array.prototype.slice.apply(arguments).slice(2));
            } else {
                return defaultResponse;
            }
        }
    }, {
        key: "getDescription",
        value: function getDescription() {
            return this.__description__;
        }
    }]);

    function Embedded_Record() {
        _classCallCheck(this, Embedded_Record);

        this.__class__ = this.constructor;
        this.__isnew__ = true;
        this.__ismodified__ = false;
        this.__fields__ = {};
        this.__oldfields__ = {};
        this.__details__ = {};
        this.__fieldslistener__ = Object.create(FieldsListener);
        this.__fieldslistener__.receiver = this;
        var props = {};
        this.__listeners__ = [];
        var description = this.__class__.getDescription();
        for (var fn in description.fields) {
            var fd = description.fields[fn];
            if (fd.type != 'detail') {
                this.__oldfields__[fn] = Field.create(fn, fd.type, fd.length, fd.persistent, fd.linkto, fd.setrecordname);
                this.__fields__[fn] = Field.create(fn, fd.type, fd.length, fd.persistent, fd.linkto, fd.setrecordname);
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
    }

    _createClass(Embedded_Record, [{
        key: "fieldModified",
        value: function fieldModified(p1, p2, p3, p4) {
            //it could be: {p1: field} or {p1: detail, p2: row, p3: rowfield, p4: oldvalue}
            this.setModifiedFlag(true);
            //[].unshift.call(arguments, this);
            for (var i = 0; i < this.__listeners__.length; i++) {
                this.__listeners__[i].fieldModified.call(this.__listeners__[i], this, p1, p2, p3, p4);
            }
        }
    }, {
        key: "rowInserted",
        value: function rowInserted(detail, row, position) {
            //it could be: {p1: field} or {p1: detail, p2: row, p3: rowfield}
            this.setModifiedFlag(true);
            for (var i = 0; i < this.__listeners__.length; i++) {
                this.__listeners__[i].rowInserted(this, detail, row, position);
            }
        }
    }, {
        key: "detailCleared",
        value: function detailCleared(detail) {
            //{p1: detail}
            this.setModifiedFlag(true);
            for (var i = 0; i < this.__listeners__.length; i++) {
                this.__listeners__[i].detailCleared(this, detail);
            }
        }
    }, {
        key: "addListener",
        value: function addListener(listener) {
            this.__listeners__.push(listener);
        }
    }, {
        key: "persistentFieldNames",
        value: function persistentFieldNames() {
            return this.__class__.__description__.persistentFieldNames;
        }
    }, {
        key: "isPersistent",
        value: function isPersistent() {
            return this.__class__.__description__.persistent;
        }
    }, {
        key: "fieldNames",
        value: function fieldNames() {
            return this.__class__.__description__.fieldnames;
        }
    }, {
        key: "persistentDetailNames",
        value: function persistentDetailNames() {
            return this.__class__.__description__.persistentDetailNames;
        }
    }, {
        key: "detailNames",
        value: function detailNames() {
            return this.__class__.__description__.detailnames;
        }
    }, {
        key: "fields",
        value: function fields(fn) {
            return this.__fields__[fn];
        }
    }, {
        key: "oldFields",
        value: function oldFields(fn) {
            return this.__oldfields__[fn];
        }
    }, {
        key: "details",
        value: function details(dn) {
            return this.__details__[dn];
        }
    }, {
        key: "hasField",
        value: function hasField(fn) {
            return fn in this.__fields__;
        }
    }, {
        key: "inspect",
        value: function inspect() {
            return "<" + this.__class__.__description__.name + ", from " + this.__class__.__description__.filename + ">";
        }
    }, {
        key: "__clearRemovedRows__XXX",
        value: function __clearRemovedRows__XXX() {
            _(this.__details__).map(function (detail) {
                detail._removed_rows__ = [];
            });
        }
    }, {
        key: "save_fromGUI",
        value: function () {
            var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
                return regeneratorRuntime.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                            case "end":
                                return _context.stop();
                        }
                    }
                }, _callee, this);
            }));

            function save_fromGUI() {
                return ref.apply(this, arguments);
            }

            return save_fromGUI;
        }()
    }, {
        key: "save",
        value: function () {
            var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee2() {
                var self, res;
                return regeneratorRuntime.wrap(function _callee2$(_context2) {
                    while (1) {
                        switch (_context2.prev = _context2.next) {
                            case 0:
                                self = this;
                                _context2.next = 3;
                                return self.check();

                            case 3:
                                res = _context2.sent;

                                if (!res) {
                                    _context2.next = 34;
                                    break;
                                }

                                if (!self.isNew()) {
                                    _context2.next = 21;
                                    break;
                                }

                                _context2.next = 8;
                                return self.beforeInsert();

                            case 8:
                                res = _context2.sent;

                                if (!res) {
                                    _context2.next = 19;
                                    break;
                                }

                                _context2.next = 12;
                                return self.store();

                            case 12:
                                res = _context2.sent;

                                if (res) {
                                    _context2.next = 15;
                                    break;
                                }

                                return _context2.abrupt("return", res);

                            case 15:
                                _context2.next = 17;
                                return self.afterInsert();

                            case 17:
                                res = _context2.sent;

                                if (res == null) res = true;

                            case 19:
                                _context2.next = 34;
                                break;

                            case 21:
                                _context2.next = 23;
                                return self.beforeUpdate();

                            case 23:
                                res = _context2.sent;

                                if (!res) {
                                    _context2.next = 34;
                                    break;
                                }

                                _context2.next = 27;
                                return self.store();

                            case 27:
                                res = _context2.sent;

                                if (res) {
                                    _context2.next = 30;
                                    break;
                                }

                                return _context2.abrupt("return", res);

                            case 30:
                                _context2.next = 32;
                                return self.afterUpdate();

                            case 32:
                                res = _context2.sent;

                                if (res == null) res = true;

                            case 34:
                                if (!res) {
                                    _context2.next = 38;
                                    break;
                                }

                                self.syncOldFields();
                                _context2.next = 40;
                                break;

                            case 38:
                                _context2.next = 40;
                                return oo.rollback();

                            case 40:
                                return _context2.abrupt("return", res);

                            case 41:
                            case "end":
                                return _context2.stop();
                        }
                    }
                }, _callee2, this);
            }));

            function save() {
                return ref.apply(this, arguments);
            }

            return save;
        }()
    }, {
        key: "syncOldFields",
        value: function syncOldFields() {
            var self = this;
            _(this.__class__.__description__.persistentFieldNames).forEach(function (fn) {
                self.oldFields(fn).setValue(self[fn]);
            });
            _(this.__class__.__description__.persistentDetailNames).forEach(function (dn) {
                //esto tiene que iterar sobre PersistentDetails!!!
                var detail = self[dn];
                for (var j = 0; j < detail.length; j++) {
                    detail[j].syncOldFields();
                }
                detail.clearRemovedRows();
            });
            self.setModifiedFlag(false);
        }
    }, {
        key: "getDocument",
        value: function () {
            var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee3() {
                return regeneratorRuntime.wrap(function _callee3$(_context3) {
                    while (1) {
                        switch (_context3.prev = _context3.next) {
                            case 0:
                                _context3.next = 2;
                                return oo.classmanager.getClass("DocumentSpec").findOne({ RecordName: this.__class__.getDescription().name });

                            case 2:
                                return _context3.abrupt("return", _context3.sent);

                            case 3:
                            case "end":
                                return _context3.stop();
                        }
                    }
                }, _callee3, this);
            }));

            function getDocument() {
                return ref.apply(this, arguments);
            }

            return getDocument;
        }()
    }, {
        key: "defaults",
        value: function () {
            var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee4() {
                return regeneratorRuntime.wrap(function _callee4$(_context4) {
                    while (1) {
                        switch (_context4.prev = _context4.next) {
                            case 0:
                                return _context4.abrupt("return");

                            case 1:
                            case "end":
                                return _context4.stop();
                        }
                    }
                }, _callee4, this);
            }));

            function defaults() {
                return ref.apply(this, arguments);
            }

            return defaults;
        }()
    }, {
        key: "check",
        value: function () {
            var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee5() {
                return regeneratorRuntime.wrap(function _callee5$(_context5) {
                    while (1) {
                        switch (_context5.prev = _context5.next) {
                            case 0:
                                return _context5.abrupt("return", true);

                            case 1:
                            case "end":
                                return _context5.stop();
                        }
                    }
                }, _callee5, this);
            }));

            function check() {
                return ref.apply(this, arguments);
            }

            return check;
        }()
    }, {
        key: "beforeInsert",
        value: function () {
            var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee6() {
                return regeneratorRuntime.wrap(function _callee6$(_context6) {
                    while (1) {
                        switch (_context6.prev = _context6.next) {
                            case 0:
                                return _context6.abrupt("return", true);

                            case 1:
                            case "end":
                                return _context6.stop();
                        }
                    }
                }, _callee6, this);
            }));

            function beforeInsert() {
                return ref.apply(this, arguments);
            }

            return beforeInsert;
        }()
    }, {
        key: "beforeUpdate",
        value: function () {
            var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee7() {
                return regeneratorRuntime.wrap(function _callee7$(_context7) {
                    while (1) {
                        switch (_context7.prev = _context7.next) {
                            case 0:
                                return _context7.abrupt("return", true);

                            case 1:
                            case "end":
                                return _context7.stop();
                        }
                    }
                }, _callee7, this);
            }));

            function beforeUpdate() {
                return ref.apply(this, arguments);
            }

            return beforeUpdate;
        }()
    }, {
        key: "afterInsert",
        value: function () {
            var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee8() {
                return regeneratorRuntime.wrap(function _callee8$(_context8) {
                    while (1) {
                        switch (_context8.prev = _context8.next) {
                            case 0:
                                return _context8.abrupt("return", true);

                            case 1:
                            case "end":
                                return _context8.stop();
                        }
                    }
                }, _callee8, this);
            }));

            function afterInsert() {
                return ref.apply(this, arguments);
            }

            return afterInsert;
        }()
    }, {
        key: "afterUpdate",
        value: function () {
            var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee9() {
                return regeneratorRuntime.wrap(function _callee9$(_context9) {
                    while (1) {
                        switch (_context9.prev = _context9.next) {
                            case 0:
                                return _context9.abrupt("return", true);

                            case 1:
                            case "end":
                                return _context9.stop();
                        }
                    }
                }, _callee9, this);
            }));

            function afterUpdate() {
                return ref.apply(this, arguments);
            }

            return afterUpdate;
        }()
    }, {
        key: "store",
        value: function () {
            var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee10() {
                var res;
                return regeneratorRuntime.wrap(function _callee10$(_context10) {
                    while (1) {
                        switch (_context10.prev = _context10.next) {
                            case 0:
                                _context10.next = 2;
                                return oo.orm.store(this);

                            case 2:
                                res = _context10.sent;

                                if (res) this.syncOldFields();
                                return _context10.abrupt("return", res);

                            case 5:
                            case "end":
                                return _context10.stop();
                        }
                    }
                }, _callee10, this);
            }));

            function store() {
                return ref.apply(this, arguments);
            }

            return store;
        }()
    }, {
        key: "delete",
        value: function () {
            var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee11() {
                return regeneratorRuntime.wrap(function _callee11$(_context11) {
                    while (1) {
                        switch (_context11.prev = _context11.next) {
                            case 0:
                                return _context11.abrupt("return", oo.orm.delete(this));

                            case 1:
                            case "end":
                                return _context11.stop();
                        }
                    }
                }, _callee11, this);
            }));

            function _delete() {
                return ref.apply(this, arguments);
            }

            return _delete;
        }()
    }, {
        key: "load",
        value: function () {
            var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee12() {
                var res;
                return regeneratorRuntime.wrap(function _callee12$(_context12) {
                    while (1) {
                        switch (_context12.prev = _context12.next) {
                            case 0:
                                res = oo.orm.load(this);

                                if (!res) {
                                    _context12.next = 4;
                                    break;
                                }

                                _context12.next = 4;
                                return this.afterLoad();

                            case 4:
                                return _context12.abrupt("return", res);

                            case 5:
                            case "end":
                                return _context12.stop();
                        }
                    }
                }, _callee12, this);
            }));

            function load() {
                return ref.apply(this, arguments);
            }

            return load;
        }()
    }, {
        key: "afterLoad",
        value: function () {
            var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee13() {
                return regeneratorRuntime.wrap(function _callee13$(_context13) {
                    while (1) {
                        switch (_context13.prev = _context13.next) {
                            case 0:
                            case "end":
                                return _context13.stop();
                        }
                    }
                }, _callee13, this);
            }));

            function afterLoad() {
                return ref.apply(this, arguments);
            }

            return afterLoad;
        }()
    }, {
        key: "isNew",

        //return oo.orm.select(this)
        value: function isNew() {
            return this.__isnew__;
        }
    }, {
        key: "isModified",
        value: function isModified() {
            return this.__ismodified__;
        }
    }, {
        key: "setModifiedFlag",
        value: function setModifiedFlag(b) {
            this.__ismodified__ = b;
        }
    }, {
        key: "setNewFlag",
        value: function setNewFlag(b) {
            return this.__isnew__ = b;
        }
    }, {
        key: "toJSON",
        value: function toJSON() {
            var obj = {
                __meta__: {
                    __isnew__: this.__isnew__,
                    __ismodified__: this.__ismodified__,
                    __classname__: this.__class__.__description__.name
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
        }
    }, {
        key: "clone",
        value: function clone() {
            var newrec = this.__class__.new();
            var fieldnames = this.fieldNames();
            for (var i = 0; i < fieldnames.length; i++) {
                var fn = fieldnames[i];
                newrec[fn] = this.fields(fn).cloneValue();
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
        }
    }, {
        key: "isEqual",
        value: function isEqual(rec) {
            if (rec.prototype != this.prototype) return false;
            var fieldnames = this.fieldNames();
            for (var i = 0; i < fieldnames.length; i++) {
                var fn = fieldnames[i];
                if (rec.fields(fn).type != this.fields(fn).type) return false;
                if (rec.fields(fn).type == 'date') {
                    if (rec[fn] != this[fn] && !rec[fn].isSame(this[fn])) {
                        console.log(fn, rec[fn], this[fn]);
                        return false;
                    }
                } else {
                    if (rec[fn] != this[fn]) {
                        console.log(fn, rec[fn], this[fn]);
                        return false;
                    }
                }
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
    }, {
        key: "fieldIsEditable",
        value: function fieldIsEditable(fieldname, rowfieldname, rownr) {
            if (rowfieldname == 'rowNr') return false;
            return true;
        }
    }], [{
        key: "findOne",
        value: function () {
            var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee14(whereClause) {
                var rec, fn, res;
                return regeneratorRuntime.wrap(function _callee14$(_context14) {
                    while (1) {
                        switch (_context14.prev = _context14.next) {
                            case 0:
                                rec = this.new();

                                for (fn in whereClause) {
                                    rec[fn] = whereClause[fn];
                                }
                                _context14.next = 4;
                                return rec.load();

                            case 4:
                                res = _context14.sent;

                                if (res) {
                                    _context14.next = 7;
                                    break;
                                }

                                return _context14.abrupt("return", null);

                            case 7:
                                return _context14.abrupt("return", rec);

                            case 8:
                            case "end":
                                return _context14.stop();
                        }
                    }
                }, _callee14, this);
            }));

            function findOne(_x) {
                return ref.apply(this, arguments);
            }

            return findOne;
        }()
    }, {
        key: "uniqueKey",
        value: function uniqueKey() {
            return [];
        }
    }, {
        key: "select",
        value: function select() {
            return Query.select(this);
        }
    }, {
        key: "fromJSON",
        value: function fromJSON(obj, rec) {
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
        }
    }]);

    return Embedded_Record;
}();

Embedded_Record.__description__ = RecordDescription;
module.exports = Embedded_Record;

//# sourceMappingURL=Embedded_Record.js.map