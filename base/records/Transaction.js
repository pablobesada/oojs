'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var cm = require('openorange').classmanager;

var Description = {
    name: 'Transaction',
    inherits: 'Numerable',
    fields: {
        User: { type: "string", length: "10" },
        Status: { type: "integer" },
        TransDate: { type: "date" },
        TransTime: { type: "time" }
    },
    filename: __filename
};

var Parent = cm.SuperClass(Description);

var Transaction = function (_Parent) {
    _inherits(Transaction, _Parent);

    function Transaction() {
        _classCallCheck(this, Transaction);

        return _possibleConstructorReturn(this, Object.getPrototypeOf(Transaction).call(this));
    }

    return Transaction;
}(Parent);

module.exports = Transaction.initClass(Description);

//# sourceMappingURL=Transaction.js.map