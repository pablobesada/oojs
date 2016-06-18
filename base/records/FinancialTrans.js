'use strict';

var cm = require('openorange').classmanager;

var Description = {
    name: 'FinancialTrans',
    inherits: 'Transaction',
    fields: {
        Currency: { type: "string", length: 3 }
    }
};

var FinancialTrans = cm.createClass(Description, __filename);

FinancialTrans.init = function init() {
    FinancialTrans.__super__.init.call(this);
    return this;
};

module.exports = FinancialTrans;

//# sourceMappingURL=FinancialTrans.js.map