'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var cm = require('openorange').classmanager;

var Description = {
    name: 'User',
    inherits: 'Master',
    fields: {
        Code: { type: "string", length: 10 },
        Name: { type: "string", length: 100 },
        AccessGroup: { type: "string", length: 10 },
        SalesGroup: { type: "string", length: 10 },
        Department: { type: "string", length: 20 },
        Person: { type: "string", length: 10, linkto: "Person" },
        Office: { type: "string", length: 20 },
        Label: { type: "set", length: 20 },
        StockDepo: { type: "string", length: 10 },
        DisableBuffers: { type: "boolean", length: 10 },
        Closed: { type: "boolean", length: 10 },
        Shift: { type: "string", length: 5 },
        DefaultReportFontSize: { type: "integer", length: 10 },
        TaskCheckingInterval: { type: "integer", length: 10 },
        Password: { type: "string", length: 130 }
    },
    filename: __filename
};

var Parent = cm.SuperClass(Description);

var User = function (_Parent) {
    _inherits(User, _Parent);

    function User() {
        _classCallCheck(this, User);

        return _possibleConstructorReturn(this, Object.getPrototypeOf(User).apply(this, arguments));
    }

    return User;
}(Parent);

module.exports = User.initClass(Description);

//# sourceMappingURL=User.js.map