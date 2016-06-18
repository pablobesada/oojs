"use strict";

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

var cm = require('openorange').classmanager;

var Description = {
    name: 'SalesOrder',
    inherits: 'SalesTransaction',
    fields: {
        SalesGroup: { type: "string", length: 20 },
        PrintFormat: { type: "integer" },
        Items: { type: "detail", class: "SalesOrderItemRow" }
    }
};

var SalesOrder = cm.createClass(Description, __filename);

SalesOrder.init = function init() {
    SalesOrder.__super__.init.call(this);
    return this;
};

SalesOrder.check = function () {
    var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
        var res;
        return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        res = SalesOrder.__super__.check.call(this);

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
}();

SalesOrder.fieldIsEditable = function fieldIsEditable(fieldname, rowfieldname, rownr) {
    //return false;
    if (rowfieldname == 'rowNr') return false;
    return true;
};
module.exports = SalesOrder;

//# sourceMappingURL=SalesOrder.js.map