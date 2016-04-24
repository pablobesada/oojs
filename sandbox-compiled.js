"use strict";

var _ = require("underscore");
//var app = require("./app")

var cm = require("./openorange").classmanager;
var SalesOrder = cm.getClass("SalesOrder");
console.log(SalesOrder.__description__.fields);
console.log(_(Object.keys(SalesOrder.__description__.fields)).filter(function (k) {
    return SalesOrder.__description__.fields[k].type != 'detail';
}));
console.log(SalesOrder);
var so = SalesOrder.new();
so.SerNr = 333;
so.CustCode = 'ABC';
var sorw = so.details("Items").newRow();
console.log(so.Items.length);
console.log(sorw);

//so.Items.push(sorw)
so.setModifiedFlag(false);
sorw.ArtCode = 'ITEM1';
console.log(sorw.ArtCode);
//console.log(sorw.__fields__.ArtCode.value)
console.log(so.Items.length);
console.log(so.isModified());

var a = [1, 2, 3, 4, 5, 6, 7, 8];
a.forEach(function (i) {
    var sorw = so.Items.newRow();
    sorw.ArtCode = "I" + i;
    so.Items.push(sorw);
});

console.log("LENGTH:", so.details("Items").length, [].length);
//so.syncVersion = 2
//console.log(so.syncVersion)
//var rec = cm.getClass("Numerable").new()
//console.log(rec.fieldNames())

so.detailNames().forEach(function (dn) {
    console.log("EE: " + dn);
});
so.load(function (err) {
    console.log("ERR : " + err);
    console.log([so.SerNr, so.CustCode]);
    so.Items.forEach(function (rw) {
        console.log([rw.masterId, rw.rowNr, rw.ArtCode]);
    });
    //so.syncVersion = 7
    //so.Items[3].ArtCode = 'ITEM3'
    console.log(so.Items.splice(0, 1));
    console.log([so.SerNr, so.CustCode]);
    so.Items.forEach(function (rw) {
        console.log([rw.masterId, rw.rowNr, rw.ArtCode]);
    });

    so.save(function (err) {
        console.log(err);
        console.log("save err: " + JSON.stringify(err));
        so.delete(function (err) {
            console.log(err);
            console.log("delete err: " + JSON.stringify(err));
            process.exit();
        });
    });
    //process.exit()
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