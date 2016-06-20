"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var cm = require('openorange').classmanager;

var Description = {
    name: 'ItemWindow',
    inherits: 'MasterWindow',
    record: 'Item',
    title: "Item Window",
    form: [{ type: 'input', field: 'Code', label: 'Codigo' }, { type: 'input', field: 'Name' }, { type: 'input', field: 'ItemGroup' }, { type: 'input', field: 'Brand' }],
    filename: __filename
};

var Parent = cm.SuperClass(Description);

var ItemWindow = function (_Parent) {
    _inherits(ItemWindow, _Parent);

    function ItemWindow() {
        _classCallCheck(this, ItemWindow);

        return _possibleConstructorReturn(this, Object.getPrototypeOf(ItemWindow).call(this));
    }

    return ItemWindow;
}(Parent);

module.exports = ItemWindow.initClass(Description);

//# sourceMappingURL=ItemWindow.js.map