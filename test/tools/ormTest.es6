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

var webdriver = require('selenium-webdriver');
let By = webdriver.By,
    until = webdriver.until,
    actions = webdriver.ActionSequence;

let port = 4001

function wait(t) {
    return new Promise(function (resolve, reject) {
        setTimeout(function () {
            resolve()
        }, t)
    });
}

let Record = cm.getClass("Record");
describe('ORM with Selenium', function () {
    before(async ()=> {
        app.serve(port);
        let q = await oo.getDBConnection()
        await q.query("delete from TestRecord")
        await q.query("delete from TestRecordRow")
        await q.query("delete from TestRecord2")
        oo.commit();
    });

    this.timeout(40000)
    it('Concurrent transaccions from different browsers', async () => {
        let runs = [true,false,false,true]
        let responses = [];
        for (let i in runs) {
            let driver = new webdriver.Builder().forBrowser('chrome').build();
            driver.get(`localhost:${port}/oo/ui`);
            //console.log(await driver.findElement(By.id("username")))
            let usernameElement = (await driver.findElement(By.id("username")))
            usernameElement.sendKeys("PDB");
            usernameElement.sendKeys(webdriver.Key.TAB);
            let passwordElement = (await driver.findElement(By.id("password")))
            passwordElement.sendKeys("123");
            passwordElement.sendKeys(webdriver.Key.TAB);
            let loginFormElement = (await driver.findElement(By.id("loginButton")))
            await wait(1000) //feo, pero funciona
            loginFormElement.click();
            //let action = new actions(driver);
            //action.moveToElement(loginFormElement).click().perform();
            driver.manage().timeouts().setScriptTimeout(200000);
            let command = `require("openorange").classmanager.getClass('ORMBrowserTests').test1('T${i}', ${runs[i]}, arguments[arguments.length - 1])`
            console.log(command)
            let resp = driver.executeAsyncScript(command)//.then(function (res) {callback(res)})")
            responses.push([driver, resp]);
        }
        console.log("-----------------------------------------------------------------------------------------------")
        await wait(20000);
        for (let i in responses) {
            let resp = responses[i][1];
            let driver = responses[i][0];
            responses[i] = await resp;
            driver.quit();
        }
        for (let j in responses) {
            let res = responses[j]
            for (let i = 0; i < res.should_exist.length; i++) {
                let r = Record.fromJSON(JSON.parse(res.should_exist[i]))
                should.exist(await cm.getClass(r.__class__.__description__.name).findOne({internalId: r.internalId, String_Field: r.String_Field}), "El registro deberia existir")
            }
            for (let i = 0; i < res.should_not_exist.length; i++) {
                let r = Record.fromJSON(JSON.parse(res.should_not_exist[i]))
                should.not.exist(await cm.getClass(r.__class__.__description__.name).findOne({String_Field: r.String_Field}), "El registro deberia existir")
            }
        }
    });
});