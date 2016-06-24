var cm = require('openorange').classmanager

var Description = {
    name: 'Transaction',
    inherits: 'Numerable',
    fields: {
        User: {type: "string", length: "10"},
        Status: {type: "integer"},
        TransDate: {type: "date"},
        TransTime: {type: "time"},
        User: {type: "string", linkto: "user" ,length: "10"}
    },
    filename: __filename
}

var Parent = cm.SuperClass(Description)

class Transaction extends Parent {

    constructor() {
        super()
    }

    async defaults() {
        super.defaults()
        let self = this;
        self.User = oo.currentUser();
    }
}

module.exports = Transaction.initClass(Description)