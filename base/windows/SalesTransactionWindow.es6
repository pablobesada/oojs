var cm = require('openorange').classmanager

var Description = {
    name: 'SalesTransactionWindow',
    inherits: 'FinancialTransWindow',
    filename: __filename
}

var Parent = cm.SuperClass(Description)
class SalesTransactionWindow extends Parent {
    constructor() {
        super()
    }

    async "changed CustCode"() {
        await Parent.tryCall(this, "changed CustCode")
        return this.getRecord().pasteCustCode();
    }
}
module.exports = SalesTransactionWindow.initClass(Description)