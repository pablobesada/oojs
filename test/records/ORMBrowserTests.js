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
            var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
                var cls, cls2, rec, i, record, res, response, saved_recs;
                return regeneratorRuntime.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                cls = oo.classmanager.getClass("TestRecord");
                                cls2 = oo.classmanager.getClass("TestRecord2");
                                rec = cls.new().fillWithRandomValues();

                                rec.beforeInsertReturnValue = true;
                                rec.SubTestName = 'TEST';
                                for (i = 0; i < 3; i++) {
                                    record = cls2.new().fillWithRandomValues();

                                    record.SubTestName = rec.SubTestName;
                                    rec.beforeInsert_recordsToStore.push(record);
                                }
                                _context.next = 8;
                                return rec.save();

                            case 8:
                                res = _context.sent;

                                console.log(res);

                                if (!res) {
                                    _context.next = 13;
                                    break;
                                }

                                _context.next = 13;
                                return oo.commit();

                            case 13:
                                response = { should_exist: [], should_not_exist: [] };
                                saved_recs = _(rec.beforeInsert_recordsToStore).map(function (r) {
                                    return JSON.stringify(r.toJSON());
                                });

                                saved_recs.push(JSON.stringify(rec.toJSON()));
                                if (res) {
                                    response.should_exist = saved_recs;
                                } else {
                                    response.should_not_exist = saved_recs;
                                }
                                return _context.abrupt("return", response);

                            case 18:
                            case "end":
                                return _context.stop();
                        }
                    }
                }, _callee, this);
            }));

            function test1() {
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