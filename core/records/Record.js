var oo = global.__main__.require('./openorange')
var cm = oo.classmanager


var Description = {
    name: 'Record',
    inherits: 'Embedded_Record',
    fields: {
        syncVersion: {type: "integer"},
    }
}

if (oo.isClient) Description.inherits = 'ClientRecord'
//console.log("parentclass of core::item: " + ParentClass.new().__description__.name)
var Record = cm.createClass(Description, __filename )
//console.log("parentclass of core::item: " + ParentClass.new().__description__.name)
Record.init = function init() {
    Record.__super__.init.call(this);
    return this
}

module.exports = Record