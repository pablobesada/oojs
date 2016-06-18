"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var cm = require('openorange').classmanager;

var Description = {
    name: 'Customer',
    inherits: 'Master',
    fields: {
        Code: { type: "string", length: 30 },
        Name: { type: "string", length: 30 },
        GroupCode: { type: "string", length: 30 },
        TaxRegNr: { type: "string", length: 30 }
    },
    filename: __filename
};

var Parent = cm.SuperClass(Description);

var Customer = function (_Parent) {
    _inherits(Customer, _Parent);

    function Customer() {
        _classCallCheck(this, Customer);

        return _possibleConstructorReturn(this, Object.getPrototypeOf(Customer).call(this));
    }

    return Customer;
}(Parent);

module.exports = Customer.initClass(Description);

//# sourceMappingURL=Customer.js.map