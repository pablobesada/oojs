"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var cm = require('openorange').classmanager;

var Description = {
    name: 'Numerable',
    inherits: 'Record',
    fields: {
        SerNr: { type: "integer" }
    },
    filename: __filename
};

var Parent = cm.SuperClass(Description);

var Numerable = function (_Parent) {
    _inherits(Numerable, _Parent);

    function Numerable() {
        _classCallCheck(this, Numerable);

        return _possibleConstructorReturn(this, Object.getPrototypeOf(Numerable).call(this));
    }

    _createClass(Numerable, [{
        key: 'fieldIsEditable',
        value: function fieldIsEditable(fieldname, rowfieldname, rowNr) {
            var self = this;
            var res = _get(Object.getPrototypeOf(Numerable.prototype), 'fieldIsEditable', this).call(this, fieldname, rowfieldname, rowNr);
            if (!res) return res;
            if (fieldname == 'SerNr' && self.SerNr == 444) return false;
            return true;
        }
    }], [{
        key: 'bring',
        value: function () {
            var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(SerNr) {
                return regeneratorRuntime.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                return _context.abrupt('return', this.findOne({ SerNr: SerNr }));

                            case 1:
                            case 'end':
                                return _context.stop();
                        }
                    }
                }, _callee, this);
            }));

            function bring(_x) {
                return ref.apply(this, arguments);
            }

            return bring;
        }()
    }]);

    return Numerable;
}(Parent);

module.exports = Numerable.initClass(Description);

//# sourceMappingURL=Numerable.js.map