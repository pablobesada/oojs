"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var oo = require("openorange");
console.log("requiring oo en Embedded_Window", oo);
var _ = require("underscore");

var WindowDescription = {
    name: 'Embedded_Window',
    inherits: null,
    filename: __filename
};

var Embedded_Window = function () {
    _createClass(Embedded_Window, [{
        key: "open",
        value: function open() {
            var wm = Object.create(oo.windowmanager).init(this);
            wm.render($('#content')[0]);
        }
    }, {
        key: "setFocus",
        value: function setFocus() {
            oo.windowmanager.setFocus(this);
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
            var parentdesc = this.__description__;
            var newdesc = {};
            newdesc.name = descriptor.name;
            newdesc.title = descriptor.title;
            newdesc.recordClass = descriptor.record;
            newdesc.form = descriptor.form;
            newdesc.filename = descriptor.filename;
            this.__description__ = newdesc;
            this.__recordClass__ = null;
            this.__super__ = Reflect.getPrototypeOf(this);
            return this;
        }
    }]);

    function Embedded_Window() {
        _classCallCheck(this, Embedded_Window);

        this.__class__ = this.constructor;
        this.__record__ = null;
        this.__listeners__ = [];
        this.__title__ = this.__class__.__description__.title;
    }

    _createClass(Embedded_Window, [{
        key: "addListener",
        value: function addListener(listener) {
            this.__listeners__.push(listener);
        }
    }, {
        key: "notifyListeners",
        value: function notifyListeners(event) {
            _(this.__listeners__).forEach(function (listener) {
                listener.update(event);
            });
        }
    }, {
        key: "getRecordClass",
        value: function getRecordClass() {
            if (this.__class__.__recordClass__ == null && this.__class__.__description__.recordClass) {
                this.__class__.__recordClass__ = oo.classmanager.getClass(this.__class__.__description__.recordClass);
            }
            return this.__class__.__recordClass__;
        }
    }, {
        key: "inspect",
        value: function inspect() {
            return "<" + this.__description__.name + ", from " + this.__filename__ + ">";
        }
    }, {
        key: "getOriginalTitle",
        value: function getOriginalTitle() {
            return this.__class__.__description__.title;
        }
    }, {
        key: "getTitle",
        value: function getTitle() {
            return this.getOriginalTitle();
        }
    }, {
        key: "notifyTitleChanged",
        value: function notifyTitleChanged() {
            this.notifyListeners({ type: "title", action: "modified", data: this.getTitle() });
        }
    }, {
        key: "setTitle",
        value: function setTitle(title) {
            this.__title__ = title;
            this.notifyListeners({ type: "title", action: "modified", data: title });
        }
    }, {
        key: "setRecord",
        value: function setRecord(rec) {
            if (this.__record__ != rec) {
                this.__record__ = rec;
                this.__record__.addListener(this);
                this.notifyListeners({ type: 'record', action: 'replaced', data: rec });
            }
        }
    }, {
        key: "fieldModified",
        value: function fieldModified(record, field, row, rowfield, oldvalue) {
            this.notifyListeners({
                type: 'field', action: 'modified', data: {
                    record: record,
                    field: field,
                    row: row,
                    rowfield: rowfield,
                    oldvalue: oldvalue
                }
            });
        }
    }, {
        key: "rowInserted",
        value: function rowInserted(record, detail, row, position) {
            this.notifyListeners({
                type: 'field', action: 'row inserted', data: {
                    record: record,
                    detail: detail,
                    row: row,
                    position: position
                }
            });
        }
    }, {
        key: "detailCleared",
        value: function detailCleared(record, detail, row, position) {
            this.notifyListeners({
                type: 'field', action: 'detail cleared', data: {
                    record: record,
                    detail: detail
                }
            });
        }
    }, {
        key: "getRecord",
        value: function getRecord(rec) {
            return this.__record__;
        }
    }, {
        key: "beforeEdit",
        value: function beforeEdit(fieldname) {
            var self = this;
            var res = true;
            if ('focus ' + fieldname in self) {
                res = self['focus ' + fieldname]();
                return res;
            }
            res = self.getRecord().fieldIsEditable(fieldname);
            return res;
        }
    }, {
        key: "beforeEditRow",
        value: function beforeEditRow(fieldname, rowfieldname, rownr) {
            var self = this;
            var res = true;
            if ('focus ' + fieldname + "." + rowfieldname in self) {
                res = self['focus ' + fieldname + "." + rowfieldname]();
                return res;
            }
            res = self.getRecord().fieldIsEditable(fieldname, rowfieldname, rownr);
            return res;
        }
    }, {
        key: "call_afterEdit",
        value: function () {
            var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(fieldname, value) {
                var self;
                return regeneratorRuntime.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                self = this;
                                //console.log(self.getRecord())

                                self.getRecord()[fieldname] = value;
                                //console.log(self.getRecord()[fieldname])

                                if (!('changed ' + fieldname in self)) {
                                    _context.next = 6;
                                    break;
                                }

                                _context.next = 5;
                                return this['changed ' + fieldname]();

                            case 5:
                                return _context.abrupt("return", _context.sent);

                            case 6:
                            case "end":
                                return _context.stop();
                        }
                    }
                }, _callee, this);
            }));

            function call_afterEdit(_x, _x2) {
                return ref.apply(this, arguments);
            }

            return call_afterEdit;
        }()
    }, {
        key: "afterEditRow",
        value: function () {
            var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(fieldname, rowfieldname, rownr, value) {
                var self;
                return regeneratorRuntime.wrap(function _callee2$(_context2) {
                    while (1) {
                        switch (_context2.prev = _context2.next) {
                            case 0:
                                self = this;

                                self.getRecord()[fieldname][rownr][rowfieldname] = value;
                                if ('changed ' + fieldname + '.' + rowfieldname in this) {
                                    this['changed ' + fieldname + '.' + rowfieldname](rownr);
                                }

                            case 3:
                            case "end":
                                return _context2.stop();
                        }
                    }
                }, _callee2, this);
            }));

            function afterEditRow(_x3, _x4, _x5, _x6) {
                return ref.apply(this, arguments);
            }

            return afterEditRow;
        }()
    }, {
        key: "save",
        value: function () {
            var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee3() {
                var rec;
                return regeneratorRuntime.wrap(function _callee3$(_context3) {
                    while (1) {
                        switch (_context3.prev = _context3.next) {
                            case 0:
                                rec = this.getRecord();

                                if (!(rec != null)) {
                                    _context3.next = 3;
                                    break;
                                }

                                return _context3.abrupt("return", rec.save());

                            case 3:
                                return _context3.abrupt("return", false);

                            case 4:
                            case "end":
                                return _context3.stop();
                        }
                    }
                }, _callee3, this);
            }));

            function save() {
                return ref.apply(this, arguments);
            }

            return save;
        }()
    }], [{
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

    return Embedded_Window;
}();

Embedded_Window.__description__ = WindowDescription;

module.exports = Embedded_Window;

//# sourceMappingURL=Embedded_Window.js.map