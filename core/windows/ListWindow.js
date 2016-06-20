"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var cm = require('openorange').classmanager;

var Description = {
    name: 'ListWindow',
    inherits: "Embedded_ListWindow",
    filename: __filename
};
var Parent = cm.SuperClass(Description);

var ListWindow = function (_Parent) {
    _inherits(ListWindow, _Parent);

    function ListWindow() {
        _classCallCheck(this, ListWindow);

        return _possibleConstructorReturn(this, Object.getPrototypeOf(ListWindow).apply(this, arguments));
    }

    return ListWindow;
}(Parent);

module.exports = ListWindow.initClass(Description);

//# sourceMappingURL=ListWindow.js.map