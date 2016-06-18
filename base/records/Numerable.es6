"use strict";
var cm = require('openorange').classmanager

var Description = {
    name: 'Numerable',
    inherits: 'Record',
    fields: {
        SerNr: {type: "integer"},
    },
    filename: __filename
}

let Parent = cm.SuperClass(Description)

class Numerable extends Parent {
    constructor() {
        super()
    }

    static async bring(SerNr) {
        var rec = this.new();
        rec.SerNr = SerNr;
        var res = await rec.load();
        if (res) return rec;
        return null
    }

    fieldIsEditable(fieldname, rowfieldname, rowNr) {
        var self = this;
        var res = super.fieldIsEditable(fieldname, rowfieldname, rowNr)
        if (!res) return res
        if (fieldname == 'SerNr' && self.SerNr == 444) return false;
        return true;
    }
}
module.exports = Numerable.initClass(Description)