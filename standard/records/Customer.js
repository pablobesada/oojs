var cm = require('openorange').classmanager

var Description = {
    name: 'Customer',
    inherits: 'Master',
    fields: {
        Code: {type: "string", length: 30},
        Name: {type: "string", length: 30},
        GroupCode: {type: "string", length: 30},
        TaxRegNr: {type: "string", length: 30},
    }
}

var Customer = cm.createClass(Description, __filename)

Customer.init = function init() {
    Customer.super("init", this);
    //console.log("en init de customer de standard")
    return this
}

module.exports = Customer
