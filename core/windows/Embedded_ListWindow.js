"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var oo = require('openorange');

var ListWindowDescription = {
    name: 'Embedded_ListWindow',
    inherits: null,
    filename: __filename
};

var Embedded_ListWindow = function () {
    _createClass(Embedded_ListWindow, null, [{
        key: 'addClassListener',
        value: function addClassListener(listener) {
            Embedded_ListWindow.__class_listeners__.push(listener);
        }
    }, {
        key: 'notifyClassListeners',
        value: function notifyClassListeners(event) {
            _(Embedded_ListWindow.__class_listeners__).forEach(function (listener) {
                listener.update(event);
            });
        }
    }, {
        key: 'initClass',
        value: function initClass(descriptor) {
            var newdesc = {};
            newdesc.name = descriptor.name;
            newdesc.title = descriptor.title;
            newdesc.recordClass = descriptor.record;
            newdesc.windowClass = descriptor.window;
            newdesc.columns = descriptor.columns;
            newdesc.filename = descriptor.filename;
            this.__description__ = newdesc;
            this.__super__ = Reflect.getPrototypeOf(this);
            this.__recordClass__ = null;
            this.__windowClass__ = null;
            return this;
        }
    }, {
        key: 'new',
        value: function _new() {
            var res = new this();
            return res;
        }
    }]);

    function Embedded_ListWindow() {
        _classCallCheck(this, Embedded_ListWindow);

        this.__class__ = this.constructor;
        this.__listeners__ = [];
    }

    _createClass(Embedded_ListWindow, [{
        key: 'addListener',
        value: function addListener(listener) {
            this.__listeners__.push(listener);
        }
    }, {
        key: 'notifyListeners',
        value: function notifyListeners(event) {
            var self = this;
            _(this.__listeners__).forEach(function (listener) {
                listener.update(event, this);
            });
        }
    }, {
        key: 'open',
        value: function open() {
            Embedded_ListWindow.notifyClassListeners({ type: "listwindow", action: "open", data: this });
        }
    }, {
        key: 'setFocus',
        value: function setFocus() {
            this.notifyListeners({ type: "listwindow", action: "setFocus", data: this });
        }
    }, {
        key: 'inspect',
        value: function inspect() {
            return "<" + this.__class__.__description__.name + ", from " + this.__class__.__description__.filename + ">";
        }
    }, {
        key: 'getTitle',
        value: function getTitle() {
            return "RECORDS";
        }
    }, {
        key: 'getRecordClass',
        value: function getRecordClass() {
            if (this.__class__.__recordClass__ == null && this.__class__.__description__.recordClass) {
                this.__class__.__recordClass__ = oo.classmanager.getClass(this.__class__.__description__.recordClass);
            }
            return this.__class__.__recordClass__;
        }
    }, {
        key: 'getWindowClass',
        value: function getWindowClass() {
            if (this.__class__.__windowClass__ == null && this.__class__.__description__.windowClass) {
                this.__class__.__windowClass__ = oo.classmanager.getClass(this.__class__.__description__.windowClass);
            }
            return this.__class__.__windowClass__;
        }
    }], [{
        key: 'tryCall',
        value: function tryCall(self, methodname) {
            if (methodname in this) {
                return this[methodname].apply(self, Array.prototype.slice.apply(arguments).slice(2));
            } else {
                return Promise.resolve();
            }
        }
    }, {
        key: 'getDescription',
        value: function getDescription() {
            return this.__description__;
        }
    }]);

    return Embedded_ListWindow;
}();

Embedded_ListWindow.__description__ = ListWindowDescription;
Embedded_ListWindow.__class_listeners__ = [];
module.exports = Embedded_ListWindow;

//# sourceMappingURL=Embedded_ListWindow.js.map