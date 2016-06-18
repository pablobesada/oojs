"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var cm = require('openorange').classmanager;

var Description = {
    name: 'CustomerWindow',
    inherits: 'MasterWindow',
    record: 'Customer',
    title: "Customer Window",
    form: [{ type: 'input', field: 'Code', label: 'Codigo' }, { type: 'input', field: 'Name' }],
    filename: __filename
};

var Parent = cm.SuperClass(Description);

var CustomerWindow = function (_Parent) {
    _inherits(CustomerWindow, _Parent);

    function CustomerWindow() {
        _classCallCheck(this, CustomerWindow);

        return _possibleConstructorReturn(this, Object.getPrototypeOf(CustomerWindow).call(this));
    }

    return CustomerWindow;
}(Parent);

module.exports = CustomerWindow.initClass(Description);

//# sourceMappingURL=CustomerWindow.js.map