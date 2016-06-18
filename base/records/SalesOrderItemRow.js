"use strict";

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

var cm = require('openorange').classmanager;

var Description = {
    name: "SalesOrderItemRow",
    inherits: "Row",
    fields: {
        ArtCode: { type: "string", length: 30 },
        Name: { type: "string", length: 30 },
        OriginType: { type: "boolean" },
        DeliveryDateRow: { type: "date" },
        DeliveryTimeRow: { type: "time" }
    }
};

var SalesOrderItemRow = cm.createClass(Description, __filename);

SalesOrderItemRow.init = function init() {
    SalesOrderItemRow.__super__.init.call(this);
    return this;
};

SalesOrderItemRow.pasteArtCode = function () {
    var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(salesorder) {
        var self, item;
        return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        self = this;

                        console.log("en pasteArtCode: " + self.ArtCode);
                        _context.next = 4;
                        return cm.getClass("Item").bring(self.ArtCode);

                    case 4:
                        item = _context.sent;

                        console.log("bringed: " + item.Name);
                        self.Name = item.Name;

                    case 7:
                    case "end":
                        return _context.stop();
                }
            }
        }, _callee, this);
    }));

    function pasteArtCode(_x) {
        return ref.apply(this, arguments);
    }

    return pasteArtCode;
}();

module.exports = SalesOrderItemRow;

//# sourceMappingURL=SalesOrderItemRow.js.map