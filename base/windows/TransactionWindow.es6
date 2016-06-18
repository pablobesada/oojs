var cm = require('openorange').classmanager

var Description = {
    name: 'TransactionWindow',
    inherits: 'NumerableWindow',
}

//console.log("parentclass of core::item: " + ParentClass.new().__description__.name)
var TransactionWindow = cm.createClass(Description, __filename )
//console.log("parentclass of core::item: " + ParentClass.new().__description__.name)
TransactionWindow.init = function init() {
    TransactionWindow.__super__.init.call(this);
    return this
}

module.exports = TransactionWindow