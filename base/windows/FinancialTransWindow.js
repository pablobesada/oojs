'use strict';

var cm = require('openorange').classmanager;

var Description = {
    name: 'FinancialTransWindow',
    inherits: 'TransactionWindow'
};

//console.log("parentclass of core::item: " + ParentClass.new().__description__.name)
var FinancialTransWindow = cm.createClass(Description, __filename);
//console.log("parentclass of core::item: " + ParentClass.new().__description__.name)
FinancialTransWindow.init = function init() {
    FinancialTransWindow.__super__.init.call(this);
    return this;
};

module.exports = FinancialTransWindow;

//# sourceMappingURL=FinancialTransWindow.js.map