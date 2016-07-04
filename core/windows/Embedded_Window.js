"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var oo = require("openorange");
var _ = require("underscore");

var WindowDescription = {
    name: 'Embedded_Window',
    inherits: null,
    actions: [],
    filename: __filename
};

var Embedded_Window = function () {
    _createClass(Embedded_Window, [{
        key: "print",
        value: function () {
            var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
                var record, document;
                return regeneratorRuntime.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                record = this.getRecord();

                                if (!record) {
                                    _context.next = 6;
                                    break;
                                }

                                _context.next = 4;
                                return record.getDocument();

                            case 4:
                                document = _context.sent;

                                if (document) document.open();

                            case 6:
                            case "end":
                                return _context.stop();
                        }
                    }
                }, _callee, this);
            }));

            function print() {
                return ref.apply(this, arguments);
            }

            return print;
        }()
    }, {
        key: "open",
        value: function open() {
            Embedded_Window.notifyClassListeners({ type: "window", action: "open", data: this });
        }
    }, {
        key: "setFocus",
        value: function setFocus() {
            this.notifyListeners({ type: "window", action: "setFocus", data: this });
        }
    }], [{
        key: "addClassListener",
        value: function addClassListener(listener) {
            Embedded_Window.__class_listeners__.push(listener);
        }
    }, {
        key: "notifyClassListeners",
        value: function notifyClassListeners(event) {
            _(Embedded_Window.__class_listeners__).forEach(function (listener) {
                listener.update(event, Embedded_Window);
            });
        }
    }, {
        key: "new",
        value: function _new() {
            var res = new this();
            return res;
        }
    }, {
        key: "initClass",
        value: function initClass(descriptor) {
            var parentdesc = this.__description__;
            var newdesc = {};
            newdesc.name = descriptor.name;
            newdesc.title = descriptor.title;
            newdesc.recordClass = descriptor.record;
            newdesc.form = descriptor.form || parentdesc.form;
            if (descriptor.override) {
                newdesc.form = this.applyFormOverride(newdesc.form, descriptor.override);
            }
            newdesc.actions = parentdesc.actions;
            if (descriptor.actions) {
                for (var i = 0; i < descriptor.actions.length; i++) {
                    newdesc.actions.push(descriptor.actions[i]);
                }
            }
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
            var self = this;
            _(this.__listeners__).forEach(function (listener) {
                listener.update(event, this);
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
            var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(fieldname, value) {
                var self;
                return regeneratorRuntime.wrap(function _callee2$(_context2) {
                    while (1) {
                        switch (_context2.prev = _context2.next) {
                            case 0:
                                self = this;
                                //console.log(self.getRecord())

                                self.getRecord()[fieldname] = value;
                                //console.log(self.getRecord()[fieldname])

                                if (!('changed ' + fieldname in self)) {
                                    _context2.next = 6;
                                    break;
                                }

                                _context2.next = 5;
                                return this['changed ' + fieldname]();

                            case 5:
                                return _context2.abrupt("return", _context2.sent);

                            case 6:
                            case "end":
                                return _context2.stop();
                        }
                    }
                }, _callee2, this);
            }));

            function call_afterEdit(_x, _x2) {
                return ref.apply(this, arguments);
            }

            return call_afterEdit;
        }()
    }, {
        key: "afterEditRow",
        value: function () {
            var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee3(fieldname, rowfieldname, rownr, value) {
                var self;
                return regeneratorRuntime.wrap(function _callee3$(_context3) {
                    while (1) {
                        switch (_context3.prev = _context3.next) {
                            case 0:
                                self = this;

                                self.getRecord()[fieldname][rownr][rowfieldname] = value;
                                if ('changed ' + fieldname + '.' + rowfieldname in this) {
                                    this['changed ' + fieldname + '.' + rowfieldname](rownr);
                                }

                            case 3:
                            case "end":
                                return _context3.stop();
                        }
                    }
                }, _callee3, this);
            }));

            function afterEditRow(_x3, _x4, _x5, _x6) {
                return ref.apply(this, arguments);
            }

            return afterEditRow;
        }()
    }, {
        key: "call_action",
        value: function () {
            var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee4(methodname) {
                return regeneratorRuntime.wrap(function _callee4$(_context4) {
                    while (1) {
                        switch (_context4.prev = _context4.next) {
                            case 0:
                                if (!this[methodname]) {
                                    _context4.next = 2;
                                    break;
                                }

                                return _context4.abrupt("return", this[methodname]());

                            case 2:
                                console.log("action " + methodname + " not found in window");

                            case 3:
                            case "end":
                                return _context4.stop();
                        }
                    }
                }, _callee4, this);
            }));

            function call_action(_x7) {
                return ref.apply(this, arguments);
            }

            return call_action;
        }()
    }, {
        key: "save",
        value: function () {
            var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee5() {
                var rec, res;
                return regeneratorRuntime.wrap(function _callee5$(_context5) {
                    while (1) {
                        switch (_context5.prev = _context5.next) {
                            case 0:
                                rec = this.getRecord();

                                if (!(rec != null)) {
                                    _context5.next = 14;
                                    break;
                                }

                                _context5.next = 4;
                                return oo.beginTransaction();

                            case 4:
                                res = _context5.sent;

                                if (res) {
                                    _context5.next = 7;
                                    break;
                                }

                                return _context5.abrupt("return", res);

                            case 7:
                                _context5.next = 9;
                                return rec.save();

                            case 9:
                                res = _context5.sent;

                                if (res) {
                                    _context5.next = 12;
                                    break;
                                }

                                return _context5.abrupt("return", res);

                            case 12:
                                res = oo.commit();
                                return _context5.abrupt("return", res);

                            case 14:
                                return _context5.abrupt("return", false);

                            case 15:
                            case "end":
                                return _context5.stop();
                        }
                    }
                }, _callee5, this);
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
    }, {
        key: "applyFormOverride",
        value: function applyFormOverride(form, patcheslist, path) {
            var findNodePath = function findNodePath(json, name, path) {
                if (json instanceof Array) {
                    for (var i = 0; i < json.length; i++) {
                        path.push(i);
                        var res = findNodePath(json[i], name, path);
                        if (res) return true;
                        path.pop();
                    }
                }
                console.log(json);
                if (json.name == name) {
                    return true;
                }
                var attr = 'content' in json ? 'content' : 'columns' in json ? 'columns' : 'pages' in json ? 'pages' : null;
                if (attr) {
                    path.push(attr);
                    var _res = findNodePath(json[attr], name, path);
                    if (_res) return true;
                    path.pop();
                }
                return false;
            };

            var newform = form;
            for (var i in patcheslist) {
                var patch = patcheslist[i];
                if ('addafter' in patch || 'addbefore' in patch || 'replace' in patch || 'remove' in patch) {
                    var action = 'addafter' in patch ? 'addafter' : 'addbefore' in patch ? 'addbefore' : 'replace' in patch ? 'replace' : 'remove';
                    var nodepath = [];
                    var res = findNodePath(form, patch[action], nodepath);
                    if (res) {
                        var nodeidx = nodepath.pop();
                        var parentnode = form;
                        for (var j = 0; j < nodepath.length; j++) {
                            parentnode = parentnode[nodepath[j]];
                        }switch (action) {
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
                    form.push(patch.add);
                } else {
                    throw new Error("Form override error. Wrong action. Needs to be addbefore, addafter, replace, add or remove.");
                }
            }
            return newform;
        }
    }]);

    return Embedded_Window;
}();

Embedded_Window.__description__ = WindowDescription;
Embedded_Window.__class_listeners__ = [];

module.exports = Embedded_Window;

//# sourceMappingURL=Embedded_Window.js.map