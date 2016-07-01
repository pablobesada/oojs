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
    until = webdriver.until,
    actions = webdriver.ActionSequence;

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
                        app.serve(port);
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
        }, _callee, _this);
    })));

    this.timeout(40000);
    it('Concurrent transaccions from different browsers', _asyncToGenerator(regeneratorRuntime.mark(function _callee2() {
        var runs, responses, i, driver, usernameElement, passwordElement, loginFormElement, command, resp, _i, _resp, _driver, j, res, _i2, r, _i3, _r;

        return regeneratorRuntime.wrap(function _callee2$(_context2) {
            while (1) {
                switch (_context2.prev = _context2.next) {
                    case 0:
                        runs = [true, false, false, true];
                        responses = [];
                        _context2.t0 = regeneratorRuntime.keys(runs);

                    case 3:
                        if ((_context2.t1 = _context2.t0()).done) {
                            _context2.next = 30;
                            break;
                        }

                        i = _context2.t1.value;
                        driver = new webdriver.Builder().forBrowser('chrome').build();

                        driver.get("localhost:" + port + "/oo/ui");
                        //console.log(await driver.findElement(By.id("username")))
                        _context2.next = 9;
                        return driver.findElement(By.id("username"));

                    case 9:
                        usernameElement = _context2.sent;

                        usernameElement.sendKeys("PDB");
                        usernameElement.sendKeys(webdriver.Key.TAB);
                        _context2.next = 14;
                        return driver.findElement(By.id("password"));

                    case 14:
                        passwordElement = _context2.sent;

                        passwordElement.sendKeys("123");
                        passwordElement.sendKeys(webdriver.Key.TAB);
                        _context2.next = 19;
                        return driver.findElement(By.id("loginButton"));

                    case 19:
                        loginFormElement = _context2.sent;
                        _context2.next = 22;
                        return wait(1000);

                    case 22:
                        //feo, pero funciona
                        loginFormElement.click();
                        //let action = new actions(driver);
                        //action.moveToElement(loginFormElement).click().perform();
                        driver.manage().timeouts().setScriptTimeout(200000);
                        command = "require(\"openorange\").classmanager.getClass('ORMBrowserTests').test1('T" + i + "', " + runs[i] + ", arguments[arguments.length - 1])";

                        console.log(command);
                        resp = driver.executeAsyncScript(command); //.then(function (res) {callback(res)})")

                        responses.push([driver, resp]);
                        _context2.next = 3;
                        break;

                    case 30:
                        console.log("-----------------------------------------------------------------------------------------------");
                        _context2.next = 33;
                        return wait(20000);

                    case 33:
                        _context2.t2 = regeneratorRuntime.keys(responses);

                    case 34:
                        if ((_context2.t3 = _context2.t2()).done) {
                            _context2.next = 44;
                            break;
                        }

                        _i = _context2.t3.value;
                        _resp = responses[_i][1];
                        _driver = responses[_i][0];
                        _context2.next = 40;
                        return _resp;

                    case 40:
                        responses[_i] = _context2.sent;

                        _driver.quit();
                        _context2.next = 34;
                        break;

                    case 44:
                        _context2.t4 = regeneratorRuntime.keys(responses);

                    case 45:
                        if ((_context2.t5 = _context2.t4()).done) {
                            _context2.next = 72;
                            break;
                        }

                        j = _context2.t5.value;
                        res = responses[j];
                        _i2 = 0;

                    case 49:
                        if (!(_i2 < res.should_exist.length)) {
                            _context2.next = 59;
                            break;
                        }

                        r = Record.fromJSON(JSON.parse(res.should_exist[_i2]));
                        _context2.t6 = should;
                        _context2.next = 54;
                        return cm.getClass(r.__class__.__description__.name).findOne({ internalId: r.internalId, String_Field: r.String_Field });

                    case 54:
                        _context2.t7 = _context2.sent;

                        _context2.t6.exist.call(_context2.t6, _context2.t7, "El registro deberia existir");

                    case 56:
                        _i2++;
                        _context2.next = 49;
                        break;

                    case 59:
                        _i3 = 0;

                    case 60:
                        if (!(_i3 < res.should_not_exist.length)) {
                            _context2.next = 70;
                            break;
                        }

                        _r = Record.fromJSON(JSON.parse(res.should_not_exist[_i3]));
                        _context2.t8 = should.not;
                        _context2.next = 65;
                        return cm.getClass(_r.__class__.__description__.name).findOne({ String_Field: _r.String_Field });

                    case 65:
                        _context2.t9 = _context2.sent;

                        _context2.t8.exist.call(_context2.t8, _context2.t9, "El registro deberia existir");

                    case 67:
                        _i3++;
                        _context2.next = 60;
                        break;

                    case 70:
                        _context2.next = 45;
                        break;

                    case 72:
                    case "end":
                        return _context2.stop();
                }
            }
        }, _callee2, _this);
    })));
});

//# sourceMappingURL=ormTest.js.map