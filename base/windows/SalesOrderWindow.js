"use strict";

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

var cm = require('openorange').classmanager;

var Description = {
    name: 'SalesOrderWindow',
    inherits: 'SalesTransactionWindow',
    record: 'SalesOrder',
    title: "Sales Order",
    form: [{ field: 'syncVersion', label: 'sync' }, { field: 'SerNr', label: 'Numero' }, { field: 'CustCode' }, { field: 'CustName', pastewindow: "CustomerPasteWindow" }, {
        type: 'tabs', pages: [{
            label: "TAB1", content: [{
                field: 'Items', columns: [{ field: 'rowNr' }, { field: 'ArtCode', label: 'Codigo' }, { field: 'Name', label: 'Descripcion' }]
            }]
        }, {
            label: "TAB2", content: [{
                field: 'Items', columns: [{ field: 'rowNr' }, { field: 'ArtCode', label: 'Codigo' }, { field: 'Name', label: 'Descripcion' }]
            }]
        }]
    }]
};

//console.log("parentclass of core::item: " + ParentClass.new().__description__.name)
var SalesOrderWindow = cm.createClass(Description, __filename);
//console.log("parentclass of core::item: " + ParentClass.new().__description__.name)
SalesOrderWindow.init = function init() {
    SalesOrderWindow.super("init", this);
    return this;
};

SalesOrderWindow["changed SerNr"] = function () {
    SalesOrderWindow.super("changed SerNr", this);
    console.log("SO: changed SerNr: " + this.getRecord().SerNr);
};

SalesOrderWindow["changed Items.ArtCode"] = function () {
    var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(rowNr) {
        var self;
        return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        self = this;
                        _context.next = 3;
                        return SalesOrderWindow.super("changed Items.ArtCode", self, rowNr);

                    case 3:
                        return _context.abrupt('return', self.getRecord().Items[rowNr].pasteArtCode(this));

                    case 4:
                    case 'end':
                        return _context.stop();
                }
            }
        }, _callee, this);
    }));

    return function (_x) {
        return ref.apply(this, arguments);
    };
}();

module.exports = SalesOrderWindow;

//# sourceMappingURL=SalesOrderWindow.js.map