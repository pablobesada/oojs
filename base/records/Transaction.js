var cm = global.__main__.require('./openorange').classmanager

var Description = {
    name: 'Transaction',
    inherits: 'Numerable',
    fields: {
        User: {type: "string", length: "10"},
        Status: {type: "integer"},
        TransDate: {type: "date"},
        TransTime: {type: "time"},
    }
}

var Transaction = cm.createClass(Description, __filename)

Transaction.init = function init() {
    Transaction.__super__.init.call(this);
    return this
}

module.exports = Transaction