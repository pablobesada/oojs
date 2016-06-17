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


SalesOrder.check = async function check() {
    var res = SalesOrder.__super__.check.call(this)
    if (!res) return res;
    return true;
}

SalesOrder.fieldIsEditable = function fieldIsEditable(fieldname, rowfieldname, rownr) {
    //return false;
    if (rowfieldname == 'rowNr') return false;
    return true;
}
module.exports = SalesOrder