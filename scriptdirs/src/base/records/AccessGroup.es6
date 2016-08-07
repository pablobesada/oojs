let _ = require("underscore")
var cm = require('openorange').classmanager

var Description = {
    name: 'AccessGroup',
    inherits: 'Master',
    fields: {
        Code: {type: "string", length: 10},
        Name: {type: "string", length: 100},
        RecordsAccessType: {type: 'integer'},
        Records: {type: 'detail', class: "AccessGroupRecordRow"},
    },
    filename: __filename
}

var Parent = cm.SuperClass(Description)

class AccessGroup extends Parent {

}

module.exports = AccessGroup.initClass(Description)

