var cm = require('openorange').classmanager

var Description = {
    name: 'Transaction',
    inherits: 'Numerable',
    fields: {
        User: {type: "string", length: "10"},
        Status: {type: "integer"},
        TransDate: {type: "date"},
        TransTime: {type: "time"},
    },
    filename: __filename
}

var Parent = cm.SuperClass(Description)

class Transaction extends Parent {

    constructor() {
        super()
    }
}

module.exports = Transaction.initClass(Description)