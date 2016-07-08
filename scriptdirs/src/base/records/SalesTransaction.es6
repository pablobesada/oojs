"use strict";
var cm = require('openorange').classmanager

var Description = {
    name: 'SalesTransaction',
    inherits: 'FinancialTrans',
    persistent: false,
    fields: {
        CustCode: {type: "string", length: 30, linkto: 'Customer'},
        CustName: {type: "string", length: 30},
    },
    filename: __filename
}

let Parent = cm.SuperClass(Description)

class SalesTransaction extends Parent {
    constructor() {
        super()
    }

    async pasteCustCode() {
        var self = this;
        if (this.CustCode) {
            let customer = await cm.getClass("Customer").bring(this.CustCode);
            if (customer) self.CustName = customer.Name;
        }
    }
}

module.exports = SalesTransaction.initClass(Description)