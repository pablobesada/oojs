"use strict";
var cm = require('openorange').classmanager

var Description = {
    name: 'SalesTransaction',
    inherits: 'FinancialTrans',
    fields: {
        CustCode: {type: "string", length: 30, linkto: 'Customer'},
        CustName: {type: "string", length: 30},
    }
}

var SalesTransaction = cm.createClass(Description, __filename)

SalesTransaction.init = function init() {
    SalesTransaction.__super__.init.call(this);
    return this
}

SalesTransaction.pasteCustCode = function pasteCustCode() {
    var self = this;
    if (this.CustCode) {
        cm.getClass("Customer").bring(this.CustCode)
            .then(function (customer) {
                self.CustName = customer.Name;
            })
    }
}

module.exports = SalesTransaction