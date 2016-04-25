var cm = global.__main__.require('./openorange').classmanager

var Description = {
    name: 'Record',
    inherits: 'Embedded_Record',
    fields: {
        syncVersion: {type: "integer"},
    }
}

//console.log("parentclass of core::item: " + ParentClass.new().__description__.name)
var Record = cm.createClass(Description, __filename )
//console.log("parentclass of core::item: " + ParentClass.new().__description__.name)
Record.init = function init() {
    Record.__super__.init.call(this);
    return this
}

module.exports = Record