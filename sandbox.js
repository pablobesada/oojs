"use strict";
var app = require("./app")
var _ = require("underscore")
var db = require("./openorange/lib/db")
//var app = require("./app")

var cm = require("./openorange").classmanager
var SalesOrder = cm.getClass("SalesOrder")
var Window = cm.getClass("Window")
var so = SalesOrder.new()
so.SerNr = 333;


so.load(function(err, callback) {
    if (!err)  {
        callback(err)
        return;
    }
    so.save(function (err, callback) {
        if (!err) {
            callback(err)
            return;
        }
        invoice.save(functo)
    })
})

Promise.resolve()
    .then(function () {
        console.log(so.CustCode)
    })
    .then(so.load)
    .then(function () {
        console.log(so.CustCode)
    })
    .then(so.delete)
    .then(function () {
        console.log("01")
    })

    .catch(function (err) {
        console.log("rrr: " + JSON.stringify(err.message))

    })
    .then(function () {
        so = SalesOrder.new()
        so.SerNr = 333;
        so.CustCode = 'AA'
        console.log("123")
        var sorw = so.Items.newRow()
        so.Items.push(sorw);
        sorw.ArtCode = "M" + so.Items.length;

        return so.save()
    })
    .then(function () {
        console.log("456")

        so.CustCode = so.CustCode + "X";
        var sorw = so.Items.newRow()
        so.Items.push(sorw);
        sorw.ArtCode = "I" + so.Items.length;

        return so.save()
    })
    .then(function () {
        console.log("saved: " + so.CustCode)
        console.log("items: " + so.Items.length)
    })
    .then(function () {
        console.log("456")

        so.CustCode = so.CustCode + "X";
        var sorw = so.Items.newRow()
        so.Items.push(sorw);
        sorw.ArtCode = "A" + so.Items.length;

        return so.save()
    })
    .then(function () {
        console.log("saved: " + so.CustCode)
        console.log("items: " + so.Items.length)
    })
    .catch(function (error) {
        console.log([error.message, error.id])
        console.log(error.stack)
        console.log("EEERRROORRR:" + JSON.stringify(error))
    })

    .then(function () {
        process.exit();
    })


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



