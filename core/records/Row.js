"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var cm = require('openorange').classmanager;

var Description = {
    name: 'Row',
    inherits: 'Embedded_Record',
    fields: {
        rowNr: { type: "integer" },
        masterId: { type: "integer" }
    },
    filename: __filename
};

//console.log("parentclass of core::item: " + ParentClass.new().__description__.name)
var Parent = cm.SuperClass(Description);
//console.log("parentclass of core::item: " + ParentClass.new().__description__.name)

var Row = function (_Parent) {
    _inherits(Row, _Parent);

    function Row() {
        _classCallCheck(this, Row);

        return _possibleConstructorReturn(this, Object.getPrototypeOf(Row).call(this));
    }

    _createClass(Row, [{
        key: 'isEmpty',
        value: function isEmpty() {
            var self = this;
            for (var i = 0; i < self.fieldNames().length; i++) {
                var fn = self.fieldNames()[i];
                if (fn == 'internalId' || fn == 'masterId' || fn == 'syncVersion' || fn == 'rowNr') continue;
                if (self[fn] != '' && self[fn] != null) return false;
            }
            return true;
        }
    }]);

    return Row;
}(Parent);

module.exports = Row.initClass(Description);

//# sourceMappingURL=Row.js.map