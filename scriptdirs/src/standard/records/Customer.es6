"use strict"

var cm = require('openorange').classmanager

var Description = {
    name: 'Customer',
    inherits: 'Master',
    fields: {
        Code: {type: "string", length: 30},
        Name: {type: "string", length: 30},
        GroupCode: {type: "string", length: 30},
        TaxRegNr: {type: "string", length: 30},
    },
    filename: __filename,
}

var Parent = cm.SuperClass(Description)

class Customer extends Parent {
    constructor() {
        super()
    }
}

module.exports = Customer.initClass(Description)
