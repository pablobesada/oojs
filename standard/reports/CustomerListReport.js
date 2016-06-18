"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var cm = require('openorange').classmanager;

var Description = {
    name: 'CustomerListReport',
    inherits: 'Report',
    title: 'Customer List Report',
    filename: __filename
};

//let CustomerListReport = cm.createClass(Description, __filename)
var Parent = cm.SuperClass(Description);

var CustomerListReport = function (_Parent) {
    _inherits(CustomerListReport, _Parent);

    function CustomerListReport() {
        _classCallCheck(this, CustomerListReport);

        return _possibleConstructorReturn(this, Object.getPrototypeOf(CustomerListReport).apply(this, arguments));
    }

    _createClass(CustomerListReport, [{
        key: 'run',
        value: function () {
            var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
                var self, order, query, results, i, rec;
                return regeneratorRuntime.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                _get(Object.getPrototypeOf(CustomerListReport.prototype), 'run', this).call(this);
                                console.log("en CustomerListReport::run");
                                self = this;
                                order = null;

                                if ('order' in self) order = self.order;
                                query = cm.getClass("Customer").select().limit(10);

                                if (self.order != null) query.order(self.order);
                                _context.next = 9;
                                return query.fetch();

                            case 9:
                                results = _context.sent;

                                self.startTable();
                                self.startHeaderRow();
                                self.addValue("Codigo", { CallMethod: 'ZoomInTest', Parameter: "LALALAHH" });
                                self.addValue("Nombre", { CallMethod: 'ZoomInTest', Parameter: "LALALAHH" });
                                self.endHeaderRow();
                                //self.row(['Segundo Codigo', 'Segundo Nombre'])
                                for (i = 0; i < results.length; i++) {
                                    rec = results[i];

                                    self.startRow();
                                    self.addValue(rec.Code, { Window: "CustomerWindow", FieldName: "Code" });
                                    self.addValue(rec.Name);
                                    self.endRow();
                                }
                                self.endTable();

                            case 17:
                            case 'end':
                                return _context.stop();
                        }
                    }
                }, _callee, this);
            }));

            function run() {
                return ref.apply(this, arguments);
            }

            return run;
        }()
    }, {
        key: 'ZoomInTest',
        value: function () {
            var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(param, value) {
                var self;
                return regeneratorRuntime.wrap(function _callee2$(_context2) {
                    while (1) {
                        switch (_context2.prev = _context2.next) {
                            case 0:
                                self = this;

                                cm.getClass("Customer").bring("C00009");
                                console.log(param, value);
                                if (value == 'Codigo') self.order = 'Code';
                                if (value == 'Nombre') self.order = 'Name';
                                self.clear();
                                self.run().then(function () {
                                    self.render();
                                });

                            case 7:
                            case 'end':
                                return _context2.stop();
                        }
                    }
                }, _callee2, this);
            }));

            function ZoomInTest(_x, _x2) {
                return ref.apply(this, arguments);
            }

            return ZoomInTest;
        }()
    }]);

    return CustomerListReport;
}(Parent);

module.exports = CustomerListReport.initClass(Description);

//# sourceMappingURL=CustomerListReport.js.map