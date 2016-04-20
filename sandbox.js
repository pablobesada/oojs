"use strict";

//var app = require("./app")

var cm = require("./openorange").classmanager
var SalesOrder = cm.getClass("SalesOrder")
console.log(SalesOrder)
var so = SalesOrder.new()
//so.SerNr = 123;
var sorw = so.details("Items").newRow()
console.log(so.Items.length)
console.log(sorw)

so.Items.push(sorw)
so.setModifiedFlag(false);
sorw.ArtCode = 'ITEM1'
console.log(sorw.__fields__.ArtCode.value)
console.log(so.Items.length)
console.log(so.isModified())
/*
so.load(function (err) {
    console.log(err);
    console.log([so.isNew(), so.isModified(), so.internalId, so.syncVersion, so.SerNr])
    so.CustName = so.CustNameName + "X";
    console.log([so.isNew(), so.isModified(), so.internalId, so.syncVersion, so.SerNr])
})
*/

/*
var Item = composer.getClass("Item")
var item = Item.new()
item.Code = 'a'
console.log(item)
var r = composer.getClass("Record").new()
console.log(r)
*/


