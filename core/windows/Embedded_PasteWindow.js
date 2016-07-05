"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var cm = require('openorange').classmanager;

var PasteWindowDescription = {
    name: 'Embedded_PasteWindow',
    inherits: null,
    filename: __filename
};

var Embedded_PasteWindow = function () {
    function Embedded_PasteWindow() {
        _classCallCheck(this, Embedded_PasteWindow);

        this.__class__ = this.constructor;
    }

    _createClass(Embedded_PasteWindow, null, [{
        key: 'initClass',
        value: function initClass(descriptor) {
            var parentdesc = this.__description__;
            var newdesc = {};
            newdesc.name = descriptor.name;
            newdesc.title = descriptor.title;
            newdesc.recordClass = descriptor.record;
            newdesc.pastefieldname = descriptor.pastefieldname;
            newdesc.columns = descriptor.columns;
            newdesc.filename = descriptor.filename;
            this.__description__ = newdesc;
            this.__super__ = Reflect.getPrototypeOf(this);
            return this;
        }
    }]);

    return Embedded_PasteWindow;
}();

Embedded_PasteWindow.__description__ = PasteWindowDescription;

module.exports = Embedded_PasteWindow;

//# sourceMappingURL=Embedded_PasteWindow.js.map