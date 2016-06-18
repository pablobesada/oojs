"use strict";
var cm = require('openorange').classmanager


var Description = {
    name: 'SalesOrder',
    inherits: 'SalesTransaction',
    fields: {
        SalesGroup: {type: "string", length: 20},
        PrintFormat: {type: "integer"},
        Items: {type: "detail", class: "SalesOrderItemRow"}
    },
    filename: __filename,
}

var Parent = cm.SuperClass(Description)

class SalesOrder extends Parent {

    constructor() {
        super()
    }


    async check() {
        var res = super.check()
        if (!res) return res;
        return true;
    }

    fieldIsEditable(fieldname, rowfieldname, rownr) {
        //return false;
        if (rowfieldname == 'rowNr') return false;
        return true;
    }
}

module.exports = SalesOrder.initClass(Description)