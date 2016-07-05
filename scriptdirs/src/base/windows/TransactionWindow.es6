var cm = require('openorange').classmanager

var Description = {
    name: 'TransactionWindow',
    inherits: 'NumerableWindow',
    filename: __filename
}

//console.log("parentclass of core::item: " + ParentClass.new().__description__.name)
let Parent = cm.SuperClass(Description)
//console.log("parentclass of core::item: " + ParentClass.new().__description__.name)
class TransactionWindow extends Parent {
    constructor() {
        super()
    }
}

module.exports = TransactionWindow.initClass(Description)