"use strict";
var cm = require('openorange').classmanager


var Description = {
    name: 'SalesOrder',
    inherits: 'SalesTransaction',
    fields: {
        SalesGroup: {type: "string", length: 30},
        PrintFormat: {type: "string"},
        Items: {type: "detail", class: "SalesOrderItemRow"}
    }
}

var SalesOrder = cm.createClass(Description, __filename)

SalesOrder.init = function init() {
    SalesOrder.__super__.init.call(this);
    return this
}


SalesOrder.check = function check() {
    return SalesOrder.__super__.check.call(this)
        .then(function () {
            return "pepe"
        })
        .then(function () {
            return new Promise(function (resolve, reject) {
                resolve("de aca no")
            })
        })
    return Promise.resolve();
}

SalesOrder.fieldIsEditable = function fieldIsEditable(fieldname, rowfieldname, rownr) {
    //return false;
    if (rowfieldname == 'rowNr') return false;
    return true;
}
module.exports = SalesOrder