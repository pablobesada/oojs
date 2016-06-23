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

before(_asyncToGenerator(regeneratorRuntime.mark(function _callee() {
    var q;
    return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
            switch (_context.prev = _context.next) {
                case 0:
                    app.serve();
                    _context.next = 3;
                    return oo.getDBConnection();

                case 3:
                    q = _context.sent;
                    _context.next = 6;
                    return q.query("delete from TestRecord");

                case 6:
                    _context.next = 8;
                    return q.query("delete from TestRecordRow");

                case 8:
                    _context.next = 10;
                    return q.query("delete from TestRecord2");

                case 10:
                    oo.commit();

                case 11:
                case "end":
                    return _context.stop();
            }
        }
    }, _callee, undefined);
})));

var Record = cm.getClass("Record");
describe('Google Search', function () {
    var _this = this;

    this.timeout(16000);
    it('should work', _asyncToGenerator(regeneratorRuntime.mark(function _callee2() {
        var driver, res, i, r, _i, _r;

        return regeneratorRuntime.wrap(function _callee2$(_context2) {
            while (1) {
                switch (_context2.prev = _context2.next) {
                    case 0:
                        driver = new webdriver.Builder().forBrowser('chrome').build();


                        driver.get('localhost:4000/app/index');
                        driver.manage().timeouts().setScriptTimeout(100000);
                        _context2.next = 5;
                        return driver.executeAsyncScript("var callback = arguments[arguments.length - 1]; cm.getClass('ORMBrowserTests').test1().then(function (res) {callback(res)})");

                    case 5:
                        res = _context2.sent;
                        i = 0;

                    case 7:
                        if (!(i < res.should_exist.length)) {
                            _context2.next = 17;
                            break;
                        }

                        r = Record.fromJSON(JSON.parse(res.should_exist[i]));
                        _context2.t0 = should;
                        _context2.next = 12;
                        return cm.getClass(r.__class__.__description__.name).findOne({ internalId: r.internalId, String_Field: r.String_Field });

                    case 12:
                        _context2.t1 = _context2.sent;

                        _context2.t0.exist.call(_context2.t0, _context2.t1, "El registro deberia existir");

                    case 14:
                        i++;
                        _context2.next = 7;
                        break;

                    case 17:
                        _i = 0;

                    case 18:
                        if (!(_i < res.should_not_exist.length)) {
                            _context2.next = 28;
                            break;
                        }

                        _r = Record.fromJSON(JSON.parse(res.should_not_exist[_i]));
                        _context2.t2 = should.not;
                        _context2.next = 23;
                        return cm.getClass(_r.__class__.__description__.name).findOne({ String_Field: _r.String_Field });

                    case 23:
                        _context2.t3 = _context2.sent;

                        _context2.t2.exist.call(_context2.t2, _context2.t3, "El registro deberia existir");

                    case 25:
                        _i++;
                        _context2.next = 18;
                        break;

                    case 28:
                        console.log(res);
                        driver.quit();

                    case 30:
                    case "end":
                        return _context2.stop();
                }
            }
        }, _callee2, _this);
    })));
});

//# sourceMappingURL=ormTest.js.map