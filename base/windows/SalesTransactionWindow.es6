var cm = require('openorange').classmanager

var Description = {
    name: 'SalesTransactionWindow',
    inherits: 'FinancialTransWindow',
}

//console.log("parentclass of core::item: " + ParentClass.new().__description__.name)
var SalesTransactionWindow = cm.createClass(Description, __filename )
//console.log("parentclass of core::item: " + ParentClass.new().__description__.name)
SalesTransactionWindow.init = function init() {
    SalesTransactionWindow.__super__.init.call(this);
    return this
}

SalesTransactionWindow["changed CustCode"] = async function () {
    await SalesTransactionWindow.super("changed CustCode", this);
    this.getRecord().pasteCustCode();
}

module.exports = SalesTransactionWindow