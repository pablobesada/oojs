var cm = require('openorange').classmanager

var Description = {
    name: 'FinancialTrans',
    inherits: 'Transaction',
    fields: {
        Currency: {type: "string", length: 3},
    },
    filename: __filename
}

var Parent = cm.SuperClass(Description)

class FinancialTrans extends Parent {

    constructor() {
        super()
    }
}
module.exports = FinancialTrans.initClass(Description)