"use strict";
var cm = global.__main__.require('./openorange').classmanager

var Description = {
    name: 'Row',
    inherits: 'Embedded_Record',
    fields: {
        rowNr: {type: "integer"},
        masterId: {type: "integer"},
    }
}

//console.log("parentclass of core::item: " + ParentClass.new().__description__.name)
var Row = cm.createClass(Description, __filename )
//console.log("parentclass of core::item: " + ParentClass.new().__description__.name)
Row.init = function init() {
    Row.super("init", this);
    return this
}

Row.isEmpty = function isEmpty() {
    var self = this;
    for (var i=0;i<self.fieldNames().length;i++) {
        var fn = self.fieldNames()[i];
        if (fn == 'internalId' || fn == 'masterId' || fn == 'syncVersion' || fn == 'rowNr') continue;
        if (self[fn] != '' && self[fn] != null) return false;
    }
    return true;
}

module.exports = Row