"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var cm = require('openorange').classmanager;

var Description = {
    name: 'TestRecordRow',
    inherits: 'Row',
    fields: {
        String_Field: { type: "string", length: 60 },
        Integer_Field: { type: "integer" }
    },
    filename: __filename
};

var Parent = cm.SuperClass(Description);

var TestRecordRow = function (_Parent) {
    _inherits(TestRecordRow, _Parent);

    function TestRecordRow() {
        _classCallCheck(this, TestRecordRow);

        return _possibleConstructorReturn(this, Object.getPrototypeOf(TestRecordRow).call(this));
    }

    return TestRecordRow;
}(Parent);

module.exports = TestRecordRow.initClass(Description);

//# sourceMappingURL=TestRecordRow.js.map