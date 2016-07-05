"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var oo = require("openorange");
var _ = require("underscore");

var ORMBrowserTests = function () {
    function ORMBrowserTests() {
        _classCallCheck(this, ORMBrowserTests);
    }

    _createClass(ORMBrowserTests, null, [{
        key: "test1",
        value: function () {
            var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(t, bir, cb) {
                var cls, cls2, rec, i, recs_to_insert, _i, record, response, saved_recs, res;

                return regeneratorRuntime.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                cls = oo.classmanager.getClass("TestRecord");
                                cls2 = oo.classmanager.getClass("TestRecord2");
                                rec = cls.new().fillWithRandomValues();

                                rec.waitBeforeReturningFromCheck = 2000;
                                rec.waitBeforeStoringRecordsInBeforeInsert = 2000;
                                for (i in rec.Rows) {
                                    rec.Rows[i].String_Field = 'ROW ' + t;
                                }rec.beforeInsertReturnValue = bir;
                                rec.SubTestName = 'TEST ' + t;
                                recs_to_insert = [];

                                for (_i = 0; _i < 3; _i++) {
                                    record = cls2.new().fillWithRandomValues();

                                    record.SubTestName = rec.SubTestName;
                                    recs_to_insert.push(record);
                                }
                                rec.setBeforeInsert_recordsToStore(recs_to_insert);
                                response = { should_exist: [], should_not_exist: [] };
                                saved_recs = _(rec.getBeforeInsert_recordsToStore()).map(function (r) {
                                    return JSON.stringify(r.toJSON());
                                });

                                saved_recs.push(JSON.stringify(rec.toJSON()));
                                if (bir) {
                                    response.should_exist = saved_recs;
                                } else {
                                    response.should_not_exist = saved_recs;
                                }
                                cb(response);
                                _context.next = 18;
                                return rec.save();

                            case 18:
                                res = _context.sent;

                                console.log(res);

                                if (!res) {
                                    _context.next = 23;
                                    break;
                                }

                                _context.next = 23;
                                return oo.commit();

                            case 23:
                            case "end":
                                return _context.stop();
                        }
                    }
                }, _callee, this);
            }));

            function test1(_x, _x2, _x3) {
                return ref.apply(this, arguments);
            }

            return test1;
        }()
    }]);

    return ORMBrowserTests;
}();

ORMBrowserTests.__description__ = { filename: __filename };
module.exports = ORMBrowserTests;

//# sourceMappingURL=ORMBrowserTests.js.map