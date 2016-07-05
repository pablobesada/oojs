'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var cm = require('openorange').classmanager;

var Description = {
    name: 'SalesTransactionWindow',
    inherits: 'FinancialTransWindow',
    filename: __filename
};

var Parent = cm.SuperClass(Description);

var SalesTransactionWindow = function (_Parent) {
    _inherits(SalesTransactionWindow, _Parent);

    function SalesTransactionWindow() {
        _classCallCheck(this, SalesTransactionWindow);

        return _possibleConstructorReturn(this, Object.getPrototypeOf(SalesTransactionWindow).call(this));
    }

    _createClass(SalesTransactionWindow, [{
        key: "changed CustCode",
        value: function () {
            var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
                return regeneratorRuntime.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                _context.next = 2;
                                return Parent.tryCall(this, null, "changed CustCode");

                            case 2:
                                return _context.abrupt('return', this.getRecord().pasteCustCode());

                            case 3:
                            case 'end':
                                return _context.stop();
                        }
                    }
                }, _callee, this);
            }));

            function changedCustCode() {
                return ref.apply(this, arguments);
            }

            return changedCustCode;
        }()
    }]);

    return SalesTransactionWindow;
}(Parent);

module.exports = SalesTransactionWindow.initClass(Description);

//# sourceMappingURL=SalesTransactionWindow.js.map