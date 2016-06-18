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
    }],
    filename: __filename
};

//console.log("parentclass of core::item: " + ParentClass.new().__description__.name)
var Parent = cm.SuperClass(Description);
//console.log("parentclass of core::item: " + ParentClass.new().__description__.name)

var SalesOrderWindow = function (_Parent) {
    _inherits(SalesOrderWindow, _Parent);

    function SalesOrderWindow() {
        _classCallCheck(this, SalesOrderWindow);

        return _possibleConstructorReturn(this, Object.getPrototypeOf(SalesOrderWindow).call(this));
    }

    _createClass(SalesOrderWindow, [{
        key: "changed SerNr",
        value: function () {
            var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
                return regeneratorRuntime.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                _context.next = 2;
                                return _get(Object.getPrototypeOf(SalesOrderWindow.prototype), "changed SerNr", this).call(this);

                            case 2:
                                console.log("SO: changed SerNr: " + this.getRecord().SerNr);

                            case 3:
                            case 'end':
                                return _context.stop();
                        }
                    }
                }, _callee, this);
            }));

            function changedSerNr() {
                return ref.apply(this, arguments);
            }

            return changedSerNr;
        }()
    }, {
        key: "changed Items.ArtCode",
        value: function () {
            var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(rowNr) {
                var self;
                return regeneratorRuntime.wrap(function _callee2$(_context2) {
                    while (1) {
                        switch (_context2.prev = _context2.next) {
                            case 0:
                                self = this;
                                _context2.next = 3;
                                return _get(Object.getPrototypeOf(SalesOrderWindow.prototype), "changed Items.ArtCode", this).call(this, rowNr);

                            case 3:
                                return _context2.abrupt('return', self.getRecord().Items[rowNr].pasteArtCode(this));

                            case 4:
                            case 'end':
                                return _context2.stop();
                        }
                    }
                }, _callee2, this);
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