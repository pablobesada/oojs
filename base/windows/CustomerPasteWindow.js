"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var cm = require('openorange').classmanager;

var Description = {
    name: 'CustomerPasteWindow',
    inherits: 'PasteWindow',
    record: 'Customer',
    title: "Customer Paste Window",
    pastefieldname: "Code",
    columns: [{ field: 'Code', label: 'Codigo' }, { field: 'Name' }, { field: 'GroupCode' }],
    filename: __filename
};

//console.log("parentclass of core::item: " + ParentClass.new().__description__.name)
var Parent = cm.SuperClass(Description);

var CustomerPasteWindow = function (_Parent) {
    _inherits(CustomerPasteWindow, _Parent);

    function CustomerPasteWindow() {
        _classCallCheck(this, CustomerPasteWindow);

        return _possibleConstructorReturn(this, Object.getPrototypeOf(CustomerPasteWindow).apply(this, arguments));
    }

    return CustomerPasteWindow;
}(Parent);

module.exports = CustomerPasteWindow.initClass(Description);

//# sourceMappingURL=CustomerPasteWindow.js.map