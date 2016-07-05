'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

//"use strict";
var cm = require('openorange').classmanager;

var Description = {
    name: 'TestRecord2',
    inherits: 'TestRecord',
    filename: __filename
};

var Parent = cm.SuperClass(Description);

var TestRecord2 = function (_Parent) {
    _inherits(TestRecord2, _Parent);

    function TestRecord2() {
        _classCallCheck(this, TestRecord2);

        return _possibleConstructorReturn(this, Object.getPrototypeOf(TestRecord2).apply(this, arguments));
    }

    return TestRecord2;
}(Parent);

module.exports = TestRecord2.initClass(Description);

//# sourceMappingURL=TestRecord2.js.map