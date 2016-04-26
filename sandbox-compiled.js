"use strict";

var app = require("./app");
var _ = require("underscore");
var db = require("./openorange/lib/db");
//var app = require("./app")

var cm = require("./openorange").classmanager;
var SalesOrder = cm.getClass("SalesOrder");
var so = SalesOrder.new();
so.SerNr = 333;

Promise.resolve().then(so.load).then(so.delete).catch(function (err) {
    console.log("rrr: " + JSON.stringify(err));
}).then(function () {
    so = SalesOrder.new();
    so.SerNr = 333;
    so.CustCode = 'AA';
    return so.save();
}).then(function () {
    so.CustCode = so.CustCode + "X";
    var sorw = so.Items.newRow();
    so.Items.push(sorw);
    sorw.ArtCode = "I" + so.Items.length;

    return so.save();
}).then(function () {
    console.log("saved: " + so.CustCode);
    console.log("items: " + so.Items.length);
}).catch(function (error) {
    console.log([error.message, error.id]);
    console.log("EEERRROORRR:" + JSON.stringify(error));
}).then(function () {
    process.exit();
});

/*so.save(function (err) {
    console.log("saved: " + err)
})*/
/*
var Item = composer.getClass("Item")
var item = Item.new()
item.Code = 'a'
console.log(item)
var r = composer.getClass("Embedded_Record").new()
console.log(r)
*/

//# sourceMappingURL=sandbox-compiled.js.map