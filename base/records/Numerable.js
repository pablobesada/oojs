"use strict";
var cm = global.__main__.require('./openorange').classmanager

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

Numerable.fieldIsEditable = function fieldIsEditable(fieldname) {
    if (fieldname == 'SerNr') return false;
    return true;
}

module.exports = Numerable