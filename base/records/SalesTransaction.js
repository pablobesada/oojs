"use strict";

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

var cm = require('openorange').classmanager;

var Description = {
    name: 'SalesTransaction',
    inherits: 'FinancialTrans',
    fields: {
        CustCode: { type: "string", length: 30, linkto: 'Customer' },
        CustName: { type: "string", length: 30 }
    }
};

var SalesTransaction = cm.createClass(Description, __filename);

SalesTransaction.init = function init() {
    SalesTransaction.__super__.init.call(this);
    return this;
};

SalesTransaction.pasteCustCode = function () {
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

                        self.CustName = customer.Name;

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
}();

module.exports = SalesTransaction;

//# sourceMappingURL=SalesTransaction.js.map