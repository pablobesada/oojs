"use strict";

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

var app = require("./../../app");
var chance = new require("chance")();
var _ = require("underscore");
var oo = require("openorange");
var Query = oo.query;
var cm = oo.classmanager;
var should = require('should');
var async = require('async');
var utils = require("../utils");

var webdriver = require('selenium-webdriver');
var By = webdriver.By,
    until = webdriver.until;

var port = 4001;

function wait(t) {
    return new Promise(function (resolve, reject) {
        setTimeout(function () {
            resolve();
        }, t);
    });
}

var Record = cm.getClass("Record");
describe('ORM with Selenium', function () {
    var _this = this;

    before(_asyncToGenerator(regeneratorRuntime.mark(function _callee() {
        var q;
        return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        console.log("en before");
                        app.serve(port);
                        _context.next = 4;
                        return oo.getDBConnection();

                    case 4:
                        q = _context.sent;
                        _context.next = 7;
                        return q.query("delete from TestRecord");

                    case 7:
                        _context.next = 9;
                        return q.query("delete from TestRecordRow");

                    case 9:
                        _context.next = 11;
                        return q.query("delete from TestRecord2");

                    case 11:
                        oo.commit();

                    case 12:
                    case "end":
                        return _context.stop();
                }
            }
        }, _callee, _this);
    })));

    this.timeout(30000);
    it('Concurrent transaccions from different browsers', _asyncToGenerator(regeneratorRuntime.mark(function _callee2() {
        var runs, responses, i, driver, command, resp, _i, _resp, _driver, j, res, _i2, r, _i3, _r;

        return regeneratorRuntime.wrap(function _callee2$(_context2) {
            while (1) {
                switch (_context2.prev = _context2.next) {
                    case 0:
                        runs = [true, false, false, true];
                        responses = [];

                        for (i in runs) {
                            driver = new webdriver.Builder().forBrowser('chrome').build();

                            driver.get("localhost:" + port + "/app/index");
                            driver.manage().timeouts().setScriptTimeout(200000);
                            command = "cm.getClass('ORMBrowserTests').test1('T" + i + "', " + runs[i] + ", arguments[arguments.length - 1])";

                            console.log(command);
                            resp = driver.executeAsyncScript(command); //.then(function (res) {callback(res)})")

                            responses.push([driver, resp]);
                        }
                        console.log("-----------------------------------------------------------------------------------------------");
                        _context2.next = 6;
                        return wait(20000);

                    case 6:
                        _context2.t0 = regeneratorRuntime.keys(responses);

                    case 7:
                        if ((_context2.t1 = _context2.t0()).done) {
                            _context2.next = 17;
                            break;
                        }

                        _i = _context2.t1.value;
                        _resp = responses[_i][1];
                        _driver = responses[_i][0];
                        _context2.next = 13;
                        return _resp;

                    case 13:
                        responses[_i] = _context2.sent;

                        _driver.quit();
                        _context2.next = 7;
                        break;

                    case 17:
                        _context2.t2 = regeneratorRuntime.keys(responses);

                    case 18:
                        if ((_context2.t3 = _context2.t2()).done) {
                            _context2.next = 45;
                            break;
                        }

                        j = _context2.t3.value;
                        res = responses[j];
                        _i2 = 0;

                    case 22:
                        if (!(_i2 < res.should_exist.length)) {
                            _context2.next = 32;
                            break;
                        }

                        r = Record.fromJSON(JSON.parse(res.should_exist[_i2]));
                        _context2.t4 = should;
                        _context2.next = 27;
                        return cm.getClass(r.__class__.__description__.name).findOne({ internalId: r.internalId, String_Field: r.String_Field });

                    case 27:
                        _context2.t5 = _context2.sent;

                        _context2.t4.exist.call(_context2.t4, _context2.t5, "El registro deberia existir");

                    case 29:
                        _i2++;
                        _context2.next = 22;
                        break;

                    case 32:
                        _i3 = 0;

                    case 33:
                        if (!(_i3 < res.should_not_exist.length)) {
                            _context2.next = 43;
                            break;
                        }

                        _r = Record.fromJSON(JSON.parse(res.should_not_exist[_i3]));
                        _context2.t6 = should.not;
                        _context2.next = 38;
                        return cm.getClass(_r.__class__.__description__.name).findOne({ String_Field: _r.String_Field });

                    case 38:
                        _context2.t7 = _context2.sent;

                        _context2.t6.exist.call(_context2.t6, _context2.t7, "El registro deberia existir");

                    case 40:
                        _i3++;
                        _context2.next = 33;
                        break;

                    case 43:
                        _context2.next = 18;
                        break;

                    case 45:
                    case "end":
                        return _context2.stop();
                }
            }
        }, _callee2, _this);
    })));
});

//# sourceMappingURL=ormTest.js.map