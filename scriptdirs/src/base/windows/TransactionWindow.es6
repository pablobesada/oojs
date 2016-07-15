var cm = require('openorange').classmanager

var Description = {
    name: 'TransactionWindow',
    inherits: 'NumerableWindow',
    filename: __filename,
    actions: [{label: 'Abrir Asiento', method: 'openNLT', icon: 'dns', group: 'basic'}]
}

//console.log("parentclass of core::item: " + ParentClass.new().__description__.name)
let Parent = cm.SuperClass(Description)
//console.log("parentclass of core::item: " + ParentClass.new().__description__.name)
class TransactionWindow extends Parent {


    openNLT() {
        alert("Abriendo asiento")
    }



}

module.exports = TransactionWindow.initClass(Description)