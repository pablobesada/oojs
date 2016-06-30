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
        Set_Field: { type: "set", length: 60, linkto: "Customer", setrecordname: "TestRecordSet_Field" },
        LinkTo_Field: { type: "string", linkto: "Customer" },
        Integer_Field: { type: "integer" },
        NonPersistent_Field: { type: "string", length: 60, persistent: false },
        Date_Field: { type: "date" },
        Rows: { type: "detail", class: "TestRecordRow" },
        NonPersistent_Rows: { type: "detail", class: "NonPersistent_TestRecordRow", persistent: false }
    },
    filename: __filename
};

var Parent = cm.SuperClass(Description);

var TestRecord = function (_Parent) {
    _inherits(TestRecord, _Parent);

    function TestRecord() {
        _classCallCheck(this, TestRecord);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(TestRecord).call(this));

        _this.waitBeforeReturningFromCheck = 0;
        _this.waitBeforeStoringRecordsInBeforeInsert = 0;
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
                                if (!(this.waitBeforeReturningFromCheck > 0)) {
                                    _context.next = 8;
                                    break;
                                }

                                _context.next = 8;
                                return TestRecord.wait(this.waitBeforeReturningCheck);

                            case 8:
                                return _context.abrupt("return", this.checkReturnValue);

                            case 9:
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
                                    _context2.next = 20;
                                    break;
                                }

                                i = _context2.t1.value;
                                record = this.beforeInsert_recordsToStore[i];

                                if (!(this.waitBeforeStoringRecordsInBeforeInsert > 0)) {
                                    _context2.next = 13;
                                    break;
                                }

                                _context2.next = 13;
                                return TestRecord.wait(this.waitBeforeStoringRecordsInBeforeInsert);

                            case 13:
                                _context2.next = 15;
                                return record.store();

                            case 15:
                                _res = _context2.sent;

                                if (_res) {
                                    _context2.next = 18;
                                    break;
                                }

                                throw new Error("no se pudo grabar registro dentro de beforeInsert");

                            case 18:
                                _context2.next = 7;
                                break;

                            case 20:
                                return _context2.abrupt("return", self.beforeInsertReturnValue);

                            case 21:
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
        value: function fillWithRandomValues(opts) {
            return this.__class__.fillRecordWithRandomValues(this, opts);
        }
    }, {
        key: "pasteLinkTo_Field",
        value: function () {
            var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee4() {
                var self, customer;
                return regeneratorRuntime.wrap(function _callee4$(_context4) {
                    while (1) {
                        switch (_context4.prev = _context4.next) {
                            case 0:
                                self = this;

                                if (!this.LinkTo_Field) {
                                    _context4.next = 6;
                                    break;
                                }

                                _context4.next = 4;
                                return cm.getClass("Customer").bring(this.LinkTo_Field);

                            case 4:
                                customer = _context4.sent;

                                if (customer) self.String_Field = customer.Name;

                            case 6:
                            case "end":
                                return _context4.stop();
                        }
                    }
                }, _callee4, this);
            }));

            function pasteLinkTo_Field() {
                return ref.apply(this, arguments);
            }

            return pasteLinkTo_Field;
        }()
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
        value: function fillRecordWithRandomValues(record, opts) {
            if (!opts) opts = {};
            var nrows = 'nrows' in opts ? opts.nrows : chance.natural({ min: 4, max: 13 });
            var cls = this;
            _(record.persistentFieldNames()).forEach(function (fn) {
                var fielddef = record.fields(fn);
                if (fn == 'internalId') return;
                if (fn == 'masterId') return;
                if (fn == 'rowNr') return;
                switch (fielddef.type) {
                    case 'string':
                        record[fn] = chance.word({ length: fielddef.length });
                        break;
                    case 'set':
                        record[fn] = chance.sentence({ words: 5 }).replace(/ /g, ",").replace(/\./g, "");
                        break;
                    case 'integer':
                        record[fn] = chance.integer({ min: -10000, max: 10000 });
                        break;
                    case 'date':
                        var v = new moment();
                        record[fn] = v;
                        break;
                    case 'time':
                        record[fn] = '07:04:33';
                        break;
                }
            });
            _(record.persistentDetailNames()).forEach(function (dn) {
                var detail = record[dn];
                for (var j = 0; j < nrows; j++) {
                    //console.log(fn)
                    var row = detail.newRow();
                    cls.fillRecordWithRandomValues(row, opts);
                    detail.push(row);
                }
            });
            return record;
        }
    }, {
        key: "newSavedRecord",
        value: function () {
            var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee5() {
                var rec;
                return regeneratorRuntime.wrap(function _callee5$(_context5) {
                    while (1) {
                        switch (_context5.prev = _context5.next) {
                            case 0:
                                rec = this.new().fillWithRandomValues();
                                _context5.next = 3;
                                return rec.store();

                            case 3:
                                if (!_context5.sent) {
                                    _context5.next = 5;
                                    break;
                                }

                                return _context5.abrupt("return", rec);

                            case 5:
                                return _context5.abrupt("return", null);

                            case 6:
                            case "end":
                                return _context5.stop();
                        }
                    }
                }, _callee5, this);
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