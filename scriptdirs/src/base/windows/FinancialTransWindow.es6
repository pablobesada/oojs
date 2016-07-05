var cm = require('openorange').classmanager

var Description = {
    name: 'FinancialTransWindow',
    inherits: 'TransactionWindow',
    filename: __filename
}

//console.log("parentclass of core::item: " + ParentClass.new().__description__.name)
var Parent = cm.SuperClass(Description)
//console.log("parentclass of core::item: " + ParentClass.new().__description__.name)
class FinancialTransWindow extends Parent {
    constructor() {
        super()
    }
}
module.exports = FinancialTransWindow.initClass(Description)