var cm = require('openorange').classmanager

var Description = {
    name: 'Item',
    inherits: 'Master',
    fields: {
        Name: {type: "string", length: 300},
        ItemGroup: {type: "string", length: 30},
        Brand: {type: "string", length: 30},
    },
    filename:__filename
}

var Parent = cm.SuperClass(Description)

class Item extends Parent {

    constructor() {
        super()

    }
}

module.exports = Item.initClass(Description)
