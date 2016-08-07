let _ = require("underscore")
var cm = require('openorange').classmanager

var Description = {
    name: 'AccessGroupRecordRow',
    inherits: 'Row',
    fields: {
        Name: {type: "string", length: 60},
        Access: {type: 'integer'},
        Visibility: {type: 'integer'},
    },
    filename: __filename
}

var Parent = cm.SuperClass(Description)

class AccessGroupRecordRow extends Parent {

}

module.exports = AccessGroupRecordRow.initClass(Description)

