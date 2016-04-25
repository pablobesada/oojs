"use strict";

var app = require("./app");
var _ = require("underscore");
var db = require("./openorange/lib/db");
//var app = require("./app")

var cm = require("./openorange").classmanager;
var SalesOrder = cm.getClass("SalesOrder");
var so = SalesOrder.new();
so.SerNr = 333;

//so.SerNr = 999
so.load().then(function () {
    console.log(arguments);
    console.log("loaded");
    console.log(so.CustCode);
    console.log(so.Items.length);
}).then(function () {
    so.CustCode = so.CustCode + "X";
    var sorw = so.Items.newRow();
    sorw.ArtCode = "I" + so.Items.length;
    so.Items.push(sorw);
    return so.save();
}).then(function () {
    console.log("saved: " + so.CustCode);
    console.log("items: " + so.Items.length);
}).catch(function (error) {
    console.log(JSON.stringify(error));
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