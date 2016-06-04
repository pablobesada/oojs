var cm = global.__main__.require('./openorange').classmanager

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

module.exports = SalesTransaction