var cm = require.main.require('./openorange').classmanager

var Description = {
    name: 'Row',
    inherits: 'Record',
    fields: {
        rowNr: {type: "integer"},
        masterId: {type: "integer"},
    }
}

//console.log("parentclass of core::item: " + ParentClass.new().__description__.name)
var Row = cm.createClass(Description, __filename )
//console.log("parentclass of core::item: " + ParentClass.new().__description__.name)
Row.init = function init() {
    Row.__super__.init.call(this);
    return this
}

module.exports = Row