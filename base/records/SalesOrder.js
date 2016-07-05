"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var cm = require('openorange').classmanager;

var Description = {
    name: 'SalesOrder',
    inherits: 'SalesTransaction',
    fields: {
        SalesGroup: { type: "string", length: 20 },
        PrintFormat: { type: "integer" },
        Items: { type: "detail", class: "SalesOrderItemRow" }
    },
    filename: __filename
};

var Parent = cm.SuperClass(Description);

var SalesOrder = function (_Parent) {
    _inherits(SalesOrder, _Parent);

    function SalesOrder() {
        _classCallCheck(this, SalesOrder);

        return _possibleConstructorReturn(this, Object.getPrototypeOf(SalesOrder).call(this));
    }

    _createClass(SalesOrder, [{
        key: 'check',
        value: function () {
            var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
                var res;
                return regeneratorRuntime.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                res = _get(Object.getPrototypeOf(SalesOrder.prototype), 'check', this).call(this);

                                if (res) {
                                    _context.next = 3;
                                    break;
                                }

                                return _context.abrupt('return', res);

                            case 3:
                                return _context.abrupt('return', true);

                            case 4:
                            case 'end':
                                return _context.stop();
                        }
                    }
                }, _callee, this);
            }));

            function check() {
                return ref.apply(this, arguments);
            }

            return check;
        }()
    }, {
        key: 'fieldIsEditable',
        value: function fieldIsEditable(fieldname, rowfieldname, rownr) {
            //return false;
            if (rowfieldname == 'rowNr') return false;
            return true;
        }
    }]);

    return SalesOrder;
}(Parent);

module.exports = SalesOrder.initClass(Description);

//# sourceMappingURL=SalesOrder.js.map