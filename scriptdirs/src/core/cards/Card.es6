"use strict" 
var oo = require('openorange')
var cm = oo.classmanager

var Description = {
    name: 'Card',
    inherits: 'Embedded_Card',
    abstract: true,
    filename: __filename
}
let Parent = cm.SuperClass(Description)

class Card extends Parent {

    constructor() {
        super()
    }

}

module.exports = Card.initClass(Description)