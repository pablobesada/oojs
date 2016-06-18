"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var cm = require('openorange').classmanager;

var Description = {
    name: 'Embedded_Report',
    inherits: null,
    filename: __filename
};

/*var Embedded_Report =  Object.create({
 '__super__': null,
 '__description__': Description,
 '__filename__': __filename,
 })*/

var Embedded_Report = function () {
    _createClass(Embedded_Report, [{
        key: 'getClass',
        value: function getClass() {
            return Object.getPrototypeOf(this);
        }
    }], [{
        key: 'define',
        value: function define(obj) {
            for (var m in obj) {
                this[m] = obj[m];
            }
            return this;
        }
    }, {
        key: 'getParentClass',
        value: function getParentClass() {
            return Object.getPrototypeOf(this);
        }
    }, {
        key: 'createChildClass',
        value: function createChildClass(descriptor, filename) {
            //console.log("en createChildClass: ", this)
            //var childclass = Object.create(this)
            var childclass = function (_ref) {
                _inherits(childclass, _ref);

                function childclass() {
                    _classCallCheck(this, childclass);

                    return _possibleConstructorReturn(this, Object.getPrototypeOf(childclass).apply(this, arguments));
                }

                return childclass;
            }(this);
            childclass.__description__ = {};
            childclass.__description__.name = descriptor.name;
            childclass.__description__.title = descriptor.title;
            childclass.__description__.window = descriptor.window ? descriptor.window : null;
            childclass.__filename__ = filename;
            childclass.__super__ = this;
            this.__recordClass__ = null;
            return childclass;
        }
    }, {
        key: 'prepareParentClass',
        value: function prepareParentClass(descriptor, filename) {
            //console.log("en createChildClass: " + this)
            //var childclass = Object.create(this)
            var childclass = function (_ref2) {
                _inherits(childclass, _ref2);

                function childclass() {
                    _classCallCheck(this, childclass);

                    return _possibleConstructorReturn(this, Object.getPrototypeOf(childclass).apply(this, arguments));
                }

                return childclass;
            }(this);
            childclass.__description__ = {};
            childclass.__description__.name = descriptor.name;
            childclass.__description__.title = descriptor.title;
            childclass.__description__.window = descriptor.window ? descriptor.window : null;
            childclass.__filename__ = filename;
            childclass.__super__ = this;
            this.__recordClass__ = null;
            return childclass;
        }
    }, {
        key: 'initClass',
        value: function initClass(descriptor) {
            console.log("en initClass: " + this);
            //var childclass = Object.create(this)
            this.__description__ = {};
            this.__description__.name = descriptor.name;
            this.__description__.title = descriptor.title;
            this.__description__.window = descriptor.window ? descriptor.window : null;
            this.__description__.filename = descriptor.filename;
            //childclass.__super__ = this;
            //this.__recordClass__ = null;
            return this;
        }
    }, {
        key: 'new',
        value: function _new() {
            var res = new this();
            res.__class__ = this;
            return res;
        }
    }, {
        key: 'findReport',
        value: function findReport(id) {
            if (id in Embedded_Report.__reports__) return Embedded_Report.__reports__[id];
            return null;
        }
    }]);

    function Embedded_Report() {
        _classCallCheck(this, Embedded_Report);

        this.__html__ = [];
        this.__id__ = Embedded_Report.ids++;
        this.__class__ = this.constructor;
        Embedded_Report.__reports__[this.__id__] = this;
        //console.log(Embedded_Report.__reports__);
        return this;
    }

    _createClass(Embedded_Report, [{
        key: 'getId',
        value: function getId() {
            return this.__id__;
        }
    }, {
        key: 'open',
        value: function () {
            var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
                var self;
                return regeneratorRuntime.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                self = this;

                                self.container = Object.create(window.ReportManager).init(self);
                                self.container.appendToWorkspace();
                                _context.next = 5;
                                return self.run();

                            case 5:
                                self.render();

                            case 6:
                            case 'end':
                                return _context.stop();
                        }
                    }
                }, _callee, this);
            }));

            function open() {
                return ref.apply(this, arguments);
            }

            return open;
        }()
    }, {
        key: 'run',
        value: function () {
            var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee2() {
                return regeneratorRuntime.wrap(function _callee2$(_context2) {
                    while (1) {
                        switch (_context2.prev = _context2.next) {
                            case 0:
                                console.log("running run de Embedded_report");

                            case 1:
                            case 'end':
                                return _context2.stop();
                        }
                    }
                }, _callee2, this);
            }));

            function run() {
                return ref.apply(this, arguments);
            }

            return run;
        }()
    }, {
        key: 'clear',
        value: function clear() {
            this.__html__ = [];
        }
    }, {
        key: 'render',
        value: function render() {
            this.container.render();
        }
    }, {
        key: 'setFocus',
        value: function setFocus() {
            window.ReportManager.setFocus(this);
        }

        /*
         Embedded_Report.super = function callSuper(methodname, self) {
         if (methodname in this.__super__) {
         return this.__super__[methodname].apply(self, Array.prototype.slice.apply(arguments).slice(2));
         } else {
         return Promise.resolve()
         }
         }
         */

    }, {
        key: 'inspect',
        value: function inspect() {
            return "<" + this.__class__.__description__.name + ", from " + this.__class__.__filename__ + ">";
        }
    }, {
        key: 'getTitle',
        value: function getTitle() {
            return this.__class__.__description__.title;
        }
    }, {
        key: 'getHTML',
        value: function getHTML() {
            return this.__html__.join("\n");
        }
    }, {
        key: 'startTable',
        value: function startTable() {
            this.__html__.push("<table>");
        }
    }, {
        key: 'endTable',
        value: function endTable() {
            this.__html__.push("</table>");
        }
    }, {
        key: 'startRow',
        value: function startRow() {
            this.__html__.push("<tr>");
        }
    }, {
        key: 'endRow',
        value: function endRow() {
            this.__html__.push("</tr>");
        }
    }, {
        key: 'startHeaderRow',
        value: function startHeaderRow() {
            this.__html__.push("<tr style='font-weight: bold'>");
        }
    }, {
        key: 'endHeaderRow',
        value: function endHeaderRow() {
            this.__html__.push("</tr>");
        }
    }, {
        key: 'header',
        value: function header(cols) {
            this.startHeaderRow();
            for (var i = 0; i < cols.length; i++) {
                this.addValue(cols[i]);
            }
            this.endHeaderRow();
        }
    }, {
        key: 'row',
        value: function row(values) {
            this.startRow();
            for (var i = 0; i < values.length; i++) {
                this.addValue(values[i]);
            }
            this.endRow();
        }
    }, {
        key: 'addValue',
        value: function addValue(v, options) {
            var value = v;
            var options = options != null ? options : {};
            var onclick = '';
            if ('Window' in options && 'FieldName' in options) {
                onclick = 'onclick="cm.getClass(\'Embedded_Report\').findReport(' + this.getId() + ').__std_zoomin__(\'' + options['Window'] + '\',\'' + options['FieldName'] + '\',\'' + value + '\')"';
            } else if ('CallMethod' in options) {
                var param = 'Parameter' in options ? "'" + options['Parameter'] + "'" : '';
                onclick = 'onclick="cm.getClass(\'Embedded_Report\').findReport(' + this.getId() + ').__call_method_zoomin__(\'' + options['CallMethod'] + '\',' + param + ',\'' + value + '\')"';
            }
            this.__html__.push("<td " + onclick + ">" + value + "</td>");
        }
    }, {
        key: '__std_zoomin__',
        value: function () {
            var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee3(w, fn, v) {
                var wnd, rec;
                return regeneratorRuntime.wrap(function _callee3$(_context3) {
                    while (1) {
                        switch (_context3.prev = _context3.next) {
                            case 0:
                                wnd = cm.getClass(w).new();
                                rec = cm.getClass(wnd.getDescription().recordClass).new();

                                rec[fn] = v;
                                _context3.next = 5;
                                return rec.load();

                            case 5:
                                if (!_context3.sent) {
                                    _context3.next = 9;
                                    break;
                                }

                                wnd.setRecord(rec);
                                wnd.open();
                                wnd.setFocus();

                            case 9:
                            case 'end':
                                return _context3.stop();
                        }
                    }
                }, _callee3, this);
            }));

            function __std_zoomin__(_x, _x2, _x3) {
                return ref.apply(this, arguments);
            }

            return __std_zoomin__;
        }()
    }, {
        key: '__call_method_zoomin__',
        value: function () {
            var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee4(method, params, value) {
                return regeneratorRuntime.wrap(function _callee4$(_context4) {
                    while (1) {
                        switch (_context4.prev = _context4.next) {
                            case 0:
                                this[method](params, value);

                            case 1:
                            case 'end':
                                return _context4.stop();
                        }
                    }
                }, _callee4, this);
            }));

            function __call_method_zoomin__(_x4, _x5, _x6) {
                return ref.apply(this, arguments);
            }

            return __call_method_zoomin__;
        }()
    }], [{
        key: 'getDescription',
        value: function getDescription() {
            return this.__description__;
        }
    }]);

    return Embedded_Report;
}();

Embedded_Report.__super__ = null;
Embedded_Report.__description__ = Description;
Embedded_Report.ids = 1;
Embedded_Report.__reports__ = [];

module.exports = Embedded_Report;

//# sourceMappingURL=Embedded_Report.js.map