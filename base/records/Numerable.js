"use strict";
var cm = require('openorange').classmanager

var Description = {
    name: 'Numerable',
    inherits: 'Record',
    fields: {
        SerNr: {type: "integer"},
    }
}

var Numerable = cm.createClass(Description, __filename)

Numerable.init = function init() {
    Numerable.__super__.init.call(this);
    return this
}

Numerable.bring = function bring(SerNr) {
    var rec = this.new();
    rec.SerNr = SerNr;
    return rec.load().then(function () {return rec})
}

Numerable.fieldIsEditable = function fieldIsEditable(fieldname, rowfieldname, rowNr) {
    var self = this;
    var res = Numerable.super("fieldIsEditable", self, fieldname, rowfieldname, rowNr)
    if (!res) return res
    if (fieldname == 'SerNr' && self.SerNr == 444) return false;
    return true;
}

module.exports = Numerable