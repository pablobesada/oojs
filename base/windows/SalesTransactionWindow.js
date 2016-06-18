'use strict';

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

var cm = require('openorange').classmanager;

var Description = {
    name: 'SalesTransactionWindow',
    inherits: 'FinancialTransWindow'
};

//console.log("parentclass of core::item: " + ParentClass.new().__description__.name)
var SalesTransactionWindow = cm.createClass(Description, __filename);
//console.log("parentclass of core::item: " + ParentClass.new().__description__.name)
SalesTransactionWindow.init = function init() {
    SalesTransactionWindow.__super__.init.call(this);
    return this;
};

SalesTransactionWindow["changed CustCode"] = _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
    return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
            switch (_context.prev = _context.next) {
                case 0:
                    _context.next = 2;
                    return SalesTransactionWindow.super("changed CustCode", this);

                case 2:
                    this.getRecord().pasteCustCode();

                case 3:
                case 'end':
                    return _context.stop();
            }
        }
    }, _callee, this);
}));

module.exports = SalesTransactionWindow;

//# sourceMappingURL=SalesTransactionWindow.js.map