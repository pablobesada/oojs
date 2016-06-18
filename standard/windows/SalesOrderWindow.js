"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var cm = require('openorange').classmanager;

var Description = {
    name: 'SalesOrderWindow',
    inherits: 'SalesTransactionWindow',
    record: 'SalesOrder',
    title: "Sales Order",
    form: [{ type: "column", content: [{ field: 'syncVersion', label: 'sync2' }, { type: "line", content: [{ field: 'SerNr', label: 'Numero' }, { field: 'CustCode' }, { field: 'TransTime' }, { field: 'TransTime', editor: 'string' }, { field: 'TransTime', editor: 'string' }] }, { field: 'CustCode', pastewindow: "CustomerPasteWindow" }] }, { field: 'TransDate' }, { field: 'TransDate', editor: 'string' }, { field: 'TransDate', editor: 'string' }, { field: 'CustName' }, { field: 'CustName' }, { field: 'PrintFormat' }, { field: 'PrintFormat', editor: 'radiobutton', options: [{ label: 'Normal', value: 0 }, { label: 'Sum per Item', value: 1 }, { label: 'Sum per Origin', value: 3 }] }, { field: 'PrintFormat', editor: 'combobox', options: [{ label: 'Normal', value: 0 }, { label: 'Sum per Item', value: 1 }, { label: 'Sum per Origin', value: 3 }] }, { field: 'User' }, { field: "Status", editor: "checkbox" }, { field: "Status", editor: "integer" }, { field: 'Status', editor: 'combobox', options: [{ label: 'NO', value: 0 }, { label: 'YES', value: 1 }] }, { field: 'Status', editor: 'radiobutton', options: [{ label: 'NO', value: 0 }, { label: 'YES', value: 1 }] },
    //{field: "Status", editor: "integer"},
    {
        type: 'tabs', pages: [{
            label: "TAB1", content: [{
                field: 'Items', columns: [{ field: 'rowNr' }, { field: 'masterId' }, { field: 'DeliveryTimeRow', editor: "string" }, { field: 'DeliveryTimeRow', editor: "time" }, { field: 'DeliveryDateRow', editor: "string" }, { field: 'DeliveryDateRow', editor: "date" }, { field: 'OriginType', editor: "string" }, { field: 'OriginType', editor: "checkbox" }, { field: 'ArtCode', label: 'Codigo', pastewindow: "ItemPasteWindow" }, { field: 'Name', label: 'Name' }, { field: 'Name', label: 'Descripcion', editor: 'combobox', options: [{ label: 'Normal', value: 0 }, { label: 'Sum per Item', value: 1 }, { label: 'Sum per Origin', value: 3 }] }]
            }]
        }, {
            label: "TAB2", content: [{
                field: 'Items', columns: [{ field: 'ArtCode', label: 'Codigo', pastewindow: 'ItemPasteWindow' }, { field: 'Name', label: 'Descripcion' }]
            }]
        }]
    }],
    filename: __filename
};

var Parent = cm.SuperClass(Description);

var SalesOrderWindow = function (_Parent) {
    _inherits(SalesOrderWindow, _Parent);

    function SalesOrderWindow() {
        _classCallCheck(this, SalesOrderWindow);

        return _possibleConstructorReturn(this, Object.getPrototypeOf(SalesOrderWindow).call(this));
    }

    _createClass(SalesOrderWindow, [{
        key: "changed PrintFormat",
        value: function () {
            var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
                return regeneratorRuntime.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                _context.next = 2;
                                return _get(Object.getPrototypeOf(SalesOrderWindow.prototype), "changed PrintFormat", this).call(this);

                            case 2:
                                console.log("SO: changed PrintFormat: " + this.getRecord().PrintFormat);

                            case 3:
                            case 'end':
                                return _context.stop();
                        }
                    }
                }, _callee, this);
            }));

            function changedPrintFormat() {
                return ref.apply(this, arguments);
            }

            return changedPrintFormat;
        }()
    }, {
        key: "changed SerNr",
        value: function () {
            var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee2() {
                return regeneratorRuntime.wrap(function _callee2$(_context2) {
                    while (1) {
                        switch (_context2.prev = _context2.next) {
                            case 0:
                                _get(Object.getPrototypeOf(SalesOrderWindow.prototype), "changed SerNr", this).call(this);
                                console.log("SO: changed SerNr: " + this.getRecord().SerNr);

                            case 2:
                            case 'end':
                                return _context2.stop();
                        }
                    }
                }, _callee2, this);
            }));

            function changedSerNr() {
                return ref.apply(this, arguments);
            }

            return changedSerNr;
        }()
    }, {
        key: "changed Items.ArtCode",
        value: function () {
            var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee3(rowNr) {
                var self;
                return regeneratorRuntime.wrap(function _callee3$(_context3) {
                    while (1) {
                        switch (_context3.prev = _context3.next) {
                            case 0:
                                self = this;
                                _context3.next = 3;
                                return _get(Object.getPrototypeOf(SalesOrderWindow.prototype), "changed Items.ArtCode", this).call(this, rowNr);

                            case 3:
                                self.getRecord().Items[rowNr].Name += 'X';

                            case 4:
                            case 'end':
                                return _context3.stop();
                        }
                    }
                }, _callee3, this);
            }));

            function changedItemsArtCode(_x) {
                return ref.apply(this, arguments);
            }

            return changedItemsArtCode;
        }()
    }]);

    return SalesOrderWindow;
}(Parent);

module.exports = SalesOrderWindow.initClass(Description);

//# sourceMappingURL=SalesOrderWindow.js.map