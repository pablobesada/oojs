var cm = global.__main__.require('./openorange').classmanager

var Description = {
    name: 'NumerableWindow',
    inherits: 'Window',
}

//console.log("parentclass of core::item: " + ParentClass.new().__description__.name)
var NumerableWindow = cm.createClass(Description, __filename )
//console.log("parentclass of core::item: " + ParentClass.new().__description__.name)
NumerableWindow.init = function init() {
    NumerableWindow.__super__.init.call(this);
    return this
}

NumerableWindow['changed SerNr'] = function () {
    console.log("en numerablewindow: changed SerNr")
}

module.exports = NumerableWindow