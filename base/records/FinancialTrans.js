'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var cm = require('openorange').classmanager;

var Description = {
    name: 'FinancialTrans',
    inherits: 'Transaction',
    fields: {
        Currency: { type: "string", length: 3 }
    },
    filename: __filename
};

var Parent = cm.SuperClass(Description);

var FinancialTrans = function (_Parent) {
    _inherits(FinancialTrans, _Parent);

    function FinancialTrans() {
        _classCallCheck(this, FinancialTrans);

        return _possibleConstructorReturn(this, Object.getPrototypeOf(FinancialTrans).call(this));
    }

    return FinancialTrans;
}(Parent);

module.exports = FinancialTrans.initClass(Description);

//# sourceMappingURL=FinancialTrans.js.map