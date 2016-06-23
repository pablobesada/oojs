"use strict";
var app = require("./../../app")
var chance = new require("chance")()
var _ = require("underscore")
var oo = require("openorange")
var Query = oo.query;
var cm = oo.classmanager
var should = require('should');
var async = require('async')
var utils = require("../utils")

var  webdriver = require('selenium-webdriver');
let By = webdriver.By,
    until = webdriver.until;

before(async ()=> {
    app.serve();
    let q = await oo.getDBConnection()
    await q.query("delete from TestRecord")
    await q.query("delete from TestRecordRow")
    await q.query("delete from TestRecord2")
    oo.commit();
});

let Record = cm.getClass("Record");
describe('Google Search', function () {
    this.timeout(16000)
    it('should work', async () => {

        var driver = new webdriver.Builder().forBrowser('chrome').build();

        driver.get('localhost:4000/app/index');
        driver.manage().timeouts().setScriptTimeout(100000);
        let res = await driver.executeAsyncScript("var callback = arguments[arguments.length - 1]; cm.getClass('ORMBrowserTests').test1().then(function (res) {callback(res)})")
        for (let i=0;i<res.should_exist.length;i++) {
            let r = Record.fromJSON(JSON.parse(res.should_exist[i]))
            should.exist(await cm.getClass(r.__class__.__description__.name).findOne({internalId: r.internalId, String_Field: r.String_Field}), "El registro deberia existir")
        }
        for (let i=0;i<res.should_not_exist.length;i++) {
            let r = Record.fromJSON(JSON.parse(res.should_not_exist[i]))
            should.not.exist(await cm.getClass(r.__class__.__description__.name).findOne({String_Field: r.String_Field}), "El registro deberia existir")
        }
        console.log(res)
        driver.quit();

    });
});