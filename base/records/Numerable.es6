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
        return this.findOne({SerNr: SerNr})
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