"use strict"

var cm = require('openorange').classmanager

var Description = {
    name: 'Master',
    inherits: 'Record',
    persistent: false,
    fields: {
        Code: {type: "string", length: 30},
        Closed: {type: "boolean"},
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
        console.log("bringing: ", Code)
        if (!Code) return null;
        return this.findOne({Code: Code})
    }

    static uniqueKey() {
        return ['Code']
    }

}

module.exports = Master.initClass(Description)
