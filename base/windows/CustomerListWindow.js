"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var cm = require('openorange').classmanager;

var Description = {
    name: 'CustomerListWindow',
    inherits: 'ListWindow',
    record: 'Customer',
    window: 'CustomerWindow',
    title: "Customers",
    columns: [{ field: 'Code', label: 'Codigo' }, { field: 'Name' }, { field: 'GroupCode' }],
    filename: __filename
};

var Parent = cm.SuperClass(Description);

var CustomerListWindow = function (_Parent) {
    _inherits(CustomerListWindow, _Parent);

    function CustomerListWindow() {
        _classCallCheck(this, CustomerListWindow);

        return _possibleConstructorReturn(this, Object.getPrototypeOf(CustomerListWindow).apply(this, arguments));
    }

    return CustomerListWindow;
}(Parent);

module.exports = CustomerListWindow.initClass(Description);

//# sourceMappingURL=CustomerListWindow.js.map