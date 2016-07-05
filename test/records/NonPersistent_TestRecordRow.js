"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var cm = require('openorange').classmanager;

var Description = {
    name: 'NonPersistent_TestRecordRow',
    inherits: 'Row',
    fields: {
        String_Field: { type: "string", length: 60 },
        Integer_Field: { type: "integer" }
    },
    filename: __filename
};

var Parent = cm.SuperClass(Description);

var NonPersistent_TestRecordRow = function (_Parent) {
    _inherits(NonPersistent_TestRecordRow, _Parent);

    function NonPersistent_TestRecordRow() {
        _classCallCheck(this, NonPersistent_TestRecordRow);

        return _possibleConstructorReturn(this, Object.getPrototypeOf(NonPersistent_TestRecordRow).call(this));
    }

    return NonPersistent_TestRecordRow;
}(Parent);

module.exports = NonPersistent_TestRecordRow.initClass(Description);

//# sourceMappingURL=NonPersistent_TestRecordRow.js.map