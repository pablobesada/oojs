"use strict";
var cm = require('openorange').classmanager

var Description = {
    name: 'Row',
    inherits: 'Embedded_Record',
    fields: {
        rowNr: {type: "integer"},
        masterId: {type: "integer"},
    },
    filename: __filename,
}

var Parent = cm.SuperClass(Description)

class Row extends Parent {
    constructor() {
        super()
    }

    isEmpty() {
        var self = this;
        for (var i = 0; i < self.fieldNames().length; i++) {
            var fn = self.fieldNames()[i];
            if (fn == 'internalId' || fn == 'masterId' || fn == 'syncVersion' || fn == 'rowNr') continue;
            if (self[fn] != '' && self[fn] != null) return false;
        }
        return true;
    }
}

module.exports = Row.initClass(Description)