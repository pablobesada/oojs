"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var oo = require('openorange');
var cm = oo.classmanager;

var Description = {
    name: 'DocumentSpecFieldsRow',
    inherits: 'Row',
    fields: {
        Name: { type: "string", length: 50 },
        Style: { type: "string", length: 20 },
        Alignment: { type: "integer" },
        Decimals: { type: "integer" },
        X: { type: "integer" },
        Y: { type: "integer" },
        Width: { type: "integer" },
        Type: { type: "integer" },
        TextLimit: { type: "integer" }
    },
    filename: __filename
};

var Parent = cm.SuperClass(Description);

var DocumentSpecFieldsRow = function (_Parent) {
    _inherits(DocumentSpecFieldsRow, _Parent);

    function DocumentSpecFieldsRow() {
        _classCallCheck(this, DocumentSpecFieldsRow);

        return _possibleConstructorReturn(this, Object.getPrototypeOf(DocumentSpecFieldsRow).call(this));
    }

    return DocumentSpecFieldsRow;
}(Parent);

module.exports = DocumentSpecFieldsRow.initClass(Description);

//# sourceMappingURL=DocumentSpecFieldsRow.js.map