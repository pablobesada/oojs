"use strict"
var oo = require('openorange')

var Description = {
    name: 'Embedded_Document',
    inherits: null,
    filename: __filename
}

class Embedded_Document {


    static initClass(descriptor) {
        return this;
    }

    static new() {
        var res = new this();
        return res;
    }

    constructor() {
        this.__class__ = this.constructor
    }
}

Embedded_Document.__description__ = Description;

module.exports = Embedded_Document