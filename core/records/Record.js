"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var oo = require('openorange');
var cm = oo.classmanager;

var Description = {
    name: 'Record',
    inherits: 'Embedded_Record',
    fields: {
        syncVersion: { type: "integer" }
    },
    filename: __filename
};

if (oo.isClient) Description.inherits = 'ClientRecord';
var Parent = cm.SuperClass(Description);

var Record = function (_Parent) {
    _inherits(Record, _Parent);

    function Record() {
        _classCallCheck(this, Record);

        return _possibleConstructorReturn(this, Object.getPrototypeOf(Record).call(this));
    }

    return Record;
}(Parent);

module.exports = Record.initClass(Description);

//# sourceMappingURL=Record.js.map