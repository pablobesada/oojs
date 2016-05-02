var cm = global.__main__.require('./openorange').classmanager

var Description = {
    name: 'Row',
    inherits: 'Embedded_Record',
    fields: {
        rowNr: {type: "integer"},
        masterId: {type: "integer"},
    }
}

//console.log("parentclass of core::item: " + ParentClass.new().__description__.name)
var Row = cm.createClass(Description, __filename )
//console.log("parentclass of core::item: " + ParentClass.new().__description__.name)
Row.init = function init() {
    Row.super("init", this);
    return this
}

module.exports = Row