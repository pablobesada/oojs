"use strict"

var cm = require('openorange').classmanager

var Description = {
    name: 'Master',
    inherits: 'Record',
    fields: {
        Code: {type: "string", length: 30},
        Name: {type: "string", length: 100},
    },
    filename: __filename,
}

var Parent = cm.SuperClass(Description)

class Master extends Parent {
    constructor() {
        super()
    }

    inspect() {
        return "<" + this.__class__.__description__.name + " " + this.Code + ">";
    }

    static async bring(Code) {
        var rec = this.new();
        rec.Code = Code;
        var res = await rec.load();
        if (res) return rec;
        return null;
    }
}

module.exports = Master.initClass(Description)
