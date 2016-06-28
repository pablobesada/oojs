"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var oo = require('openorange');

var Description = {
    name: 'Embedded_Document',
    inherits: null,
    filename: __filename
};

var Embedded_Document = function () {
    _createClass(Embedded_Document, null, [{
        key: 'initClass',
        value: function initClass(descriptor) {
            return this;
        }
    }, {
        key: 'new',
        value: function _new() {
            var res = new this();
            return res;
        }
    }]);

    function Embedded_Document() {
        _classCallCheck(this, Embedded_Document);

        this.__class__ = this.constructor;
    }

    return Embedded_Document;
}();

Embedded_Document.__description__ = Description;

module.exports = Embedded_Document;

//# sourceMappingURL=Embedded_Document.js.map