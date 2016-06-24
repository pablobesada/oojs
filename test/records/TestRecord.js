"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var cm = require('openorange').classmanager;
var _ = require("underscore");
var chance = require("chance")();
var moment = require("moment");

var Description = {
    name: 'TestRecord',
    inherits: 'Record',
    fields: {
        TestName: { type: "string", length: 60 },
        SubTestName: { type: "string", length: 60 },
        String_Field: { type: "string", length: 60 },
        Integer_Field: { type: "integer" },
        Date_Field: { type: "date" },
        Rows: { type: "detail", class: "TestRecordRow" }
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
        _this.beforeInsert_recordsToStore = [];
        return _this;
    }

    _createClass(TestRecord, [{
        key: "check",
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

                                return _context.abrupt("return", res);

                            case 5:
                                _context.next = 7;
                                return TestRecord.wait(2000);

                            case 7:
                                return _context.abrupt("return", this.checkReturnValue);

                            case 8:
                            case "end":
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
        key: "beforeInsert",
        value: function () {
            var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee2() {
                var self, res, i, record, _res;

                return regeneratorRuntime.wrap(function _callee2$(_context2) {
                    while (1) {
                        switch (_context2.prev = _context2.next) {
                            case 0:
                                self = this;
                                _context2.next = 3;
                                return Parent.tryCall(this, true, "beforeInsert");

                            case 3:
                                res = _context2.sent;

                                if (res) {
                                    _context2.next = 6;
                                    break;
                                }

                                return _context2.abrupt("return", res);

                            case 6:
                                _context2.t0 = regeneratorRuntime.keys(this.beforeInsert_recordsToStore);

                            case 7:
                                if ((_context2.t1 = _context2.t0()).done) {
                                    _context2.next = 19;
                                    break;
                                }

                                i = _context2.t1.value;
                                record = this.beforeInsert_recordsToStore[i];
                                _context2.next = 12;
                                return TestRecord.wait(2000);

                            case 12:
                                _context2.next = 14;
                                return record.store();

                            case 14:
                                _res = _context2.sent;

                                if (_res) {
                                    _context2.next = 17;
                                    break;
                                }

                                throw new Error("no se pudo grabar registro dentro de beforeInsert");

                            case 17:
                                _context2.next = 7;
                                break;

                            case 19:
                                return _context2.abrupt("return", self.beforeInsertReturnValue);

                            case 20:
                            case "end":
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
        key: "beforeUpdate",
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

                                return _context3.abrupt("return", res);

                            case 5:
                                return _context3.abrupt("return", this.beforeUpdateReturnValue);

                            case 6:
                            case "end":
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
    }, {
        key: "fillWithRandomValues",
        value: function fillWithRandomValues() {
            return this.__class__.fillRecordWithRandomValues(this);
        }
    }], [{
        key: "wait",
        value: function wait(t) {
            return new Promise(function (resolve, reject) {
                setTimeout(function () {
                    resolve();
                }, t);
            });
        }
    }, {
        key: "fillRecordWithRandomValues",
        value: function fillRecordWithRandomValues(record) {
            console.log("AAAAASDASDASDASDASDASDS");
            var cls = this;
            var fields = record.__class__.getDescription().fields;
            _(fields).forEach(function (fielddef, fn) {
                if (fn == 'internalId') return;
                if (fn == 'masterId') return;
                if (fn == 'rowNr') return;
                console.log(fn, fielddef);
                switch (fielddef.type) {
                    case 'string':
                        record[fn] = chance.word({ length: fielddef.length });
                        break;
                    case 'integer':
                        record[fn] = chance.integer({ min: -10000, max: 10000 });
                        break;
                    case 'date':
                        var v = new moment();
                        record[fn] = v;
                        console.log(v, record[fn]);
                        break;
                    case 'time':
                        //record[fn] = moment()
                        record[fn] = '07:04:33';
                        break;
                    case 'detail':
                        var nrows = chance.natural({ min: 4, max: 13 });
                        for (var j = 0; j < nrows; j++) {
                            //console.log(fn)
                            var row = record[fn].newRow();
                            cls.fillRecordWithRandomValues(row);
                            record[fn].push(row);
                        }
                }
            });
            return record;
        }
    }, {
        key: "newSavedRecord",
        value: function () {
            var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee4() {
                var rec;
                return regeneratorRuntime.wrap(function _callee4$(_context4) {
                    while (1) {
                        switch (_context4.prev = _context4.next) {
                            case 0:
                                rec = this.new().fillWithRandomValues();
                                _context4.next = 3;
                                return rec.store();

                            case 3:
                                if (!_context4.sent) {
                                    _context4.next = 5;
                                    break;
                                }

                                return _context4.abrupt("return", rec);

                            case 5:
                                return _context4.abrupt("return", null);

                            case 6:
                            case "end":
                                return _context4.stop();
                        }
                    }
                }, _callee4, this);
            }));

            function newSavedRecord() {
                return ref.apply(this, arguments);
            }

            return newSavedRecord;
        }()
    }]);

    return TestRecord;
}(Parent);

module.exports = TestRecord.initClass(Description);

//# sourceMappingURL=TestRecord.js.map