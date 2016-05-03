var cm = global.__main__.require('./openorange').classmanager

var Description = {
    name: 'Item',
    inherits: 'Master',
    fields: {
        ItemGroup: {type: "string", length: 30},
        Brand: {type: "string", length: 30},
    }
}

//console.log("parentclass of core::item: " + ParentClass.new().__description__.name)
var Item = cm.createClass(Description, __filename)

Item.init = function init() {
    Item.super("init", this);
    return this
}

module.exports = Item
