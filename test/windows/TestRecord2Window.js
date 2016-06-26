"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var cm = require('openorange').classmanager;

var Description = {
    name: 'TestRecord2Window',
    inherits: 'TestRecordWindow',
    record: 'TestRecord2',
    title: "Test Record 2 Window",
    filename: __filename,
    override: [{ add: { field: "internalId", label: "added after LTF" } }]
};

var Parent = cm.SuperClass(Description);

var TestRecord2Window = function (_Parent) {
    _inherits(TestRecord2Window, _Parent);

    function TestRecord2Window() {
        _classCallCheck(this, TestRecord2Window);

        return _possibleConstructorReturn(this, Object.getPrototypeOf(TestRecord2Window).call(this));
    }

    return TestRecord2Window;
}(Parent);

module.exports = TestRecord2Window.initClass(Description);

//# sourceMappingURL=TestRecord2Window.js.map