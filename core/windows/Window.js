var cm = global.__main__.require('./openorange').classmanager

var Description = {
    name: 'Window',
    inherits: 'Embedded_Window',
}

//console.log("parentclass of core::item: " + ParentClass.new().__description__.name)
var Window = cm.createClass(Description, __filename )
//console.log("parentclass of core::item: " + ParentClass.new().__description__.name)
Window.init = function init() {
    Window.__super__.init.call(this);
    return this
}

module.exports = Window