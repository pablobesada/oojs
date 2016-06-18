"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var cm = require('openorange').classmanager;

var Description = {
    name: 'SalesTransaction',
    inherits: 'FinancialTrans',
    fields: {
        CustCode: { type: "string", length: 30, linkto: 'Customer' },
        CustName: { type: "string", length: 30 }
    },
    filename: __filename
};

var Parent = cm.SuperClass(Description);

var SalesTransaction = function (_Parent) {
    _inherits(SalesTransaction, _Parent);

    function SalesTransaction() {
        _classCallCheck(this, SalesTransaction);

        return _possibleConstructorReturn(this, Object.getPrototypeOf(SalesTransaction).call(this));
    }

    _createClass(SalesTransaction, [{
        key: 'pasteCustCode',
        value: function () {
            var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
                var self, customer;
                return regeneratorRuntime.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                self = this;

                                if (!this.CustCode) {
                                    _context.next = 6;
                                    break;
                                }

                                _context.next = 4;
                                return cm.getClass("Customer").bring(this.CustCode);

                            case 4:
                                customer = _context.sent;

                                if (customer) self.CustName = customer.Name;

                            case 6:
                            case 'end':
                                return _context.stop();
                        }
                    }
                }, _callee, this);
            }));

            function pasteCustCode() {
                return ref.apply(this, arguments);
            }

            return pasteCustCode;
        }()
    }]);

    return SalesTransaction;
}(Parent);

module.exports = SalesTransaction.initClass(Description);

//# sourceMappingURL=SalesTransaction.js.map