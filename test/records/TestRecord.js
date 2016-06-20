'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

//"use strict";
var cm = require('openorange').classmanager;

var Description = {
    name: 'TestRecord',
    inherits: 'Record',
    fields: {
        String_Field: { type: "string", length: 60 },
        Integer_Field: { type: "integer" }
    },
    filename: __filename
};

var Parent = cm.SuperClass(Description);

var TestRecord = function (_Parent) {
    _inherits(TestRecord, _Parent);

    function TestRecord() {
        _classCallCheck(this, TestRecord);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(TestRecord).call(this));

        _this.checkReturnValue = true;
        _this.beforeInsertReturnValue = true;
        _this.beforeUpdateReturnValue = true;
        return _this;
    }

    _createClass(TestRecord, [{
        key: 'check',
        value: function () {
            var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
                var res;
                return regeneratorRuntime.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                _context.next = 2;
                                return Parent.tryCall(this, true, "check");

                            case 2:
                                res = _context.sent;

                                if (res) {
                                    _context.next = 5;
                                    break;
                                }

                                return _context.abrupt('return', res);

                            case 5:
                                return _context.abrupt('return', this.checkReturnValue);

                            case 6:
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
        }()
    }, {
        key: 'beforeInsert',
        value: function () {
            var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee2() {
                var res;
                return regeneratorRuntime.wrap(function _callee2$(_context2) {
                    while (1) {
                        switch (_context2.prev = _context2.next) {
                            case 0:
                                _context2.next = 2;
                                return Parent.tryCall(this, true, "beforeInsert");

                            case 2:
                                res = _context2.sent;

                                if (res) {
                                    _context2.next = 5;
                                    break;
                                }

                                return _context2.abrupt('return', res);

                            case 5:
                                return _context2.abrupt('return', this.beforeInsertReturnValue);

                            case 6:
                            case 'end':
                                return _context2.stop();
                        }
                    }
                }, _callee2, this);
            }));

            function beforeInsert() {
                return ref.apply(this, arguments);
            }

            return beforeInsert;
        }()
    }, {
        key: 'beforeUpdate',
        value: function () {
            var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee3() {
                var res;
                return regeneratorRuntime.wrap(function _callee3$(_context3) {
                    while (1) {
                        switch (_context3.prev = _context3.next) {
                            case 0:
                                _context3.next = 2;
                                return Parent.tryCall(this, true, "beforeUpdate");

                            case 2:
                                res = _context3.sent;

                                if (res) {
                                    _context3.next = 5;
                                    break;
                                }

                                return _context3.abrupt('return', res);

                            case 5:
                                return _context3.abrupt('return', this.beforeUpdateReturnValue);

                            case 6:
                            case 'end':
                                return _context3.stop();
                        }
                    }
                }, _callee3, this);
            }));

            function beforeUpdate() {
                return ref.apply(this, arguments);
            }

            return beforeUpdate;
        }()
    }]);

    return TestRecord;
}(Parent);

module.exports = TestRecord.initClass(Description);

//# sourceMappingURL=TestRecord.js.map