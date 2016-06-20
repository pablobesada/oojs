"use strict"
var cm = require('openorange').classmanager

var Description = {
    name: 'Company',
    inherits: 'LocalRecord',
    fields: {
        Code: {type: "string", length: 30},
        Name: {type: "string", length: 30},
    },
    filename: __filename
}

var Parent = cm.SuperClass(Description)

class Company extends Parent {
    constructor() {
        super()
    }

    inspect() {
        return "<" + this.__class__.__description__.name + " " + this.Code + ">";
    }

    static async bring(Code) {
        return this.findOne({Code: Code})
    }

}

module.exports = Company.initClass(Description)
