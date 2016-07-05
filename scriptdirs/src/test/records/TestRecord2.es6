//"use strict";
var cm = require('openorange').classmanager

var Description = {
    name: 'TestRecord2',
    inherits: 'TestRecord',
    filename: __filename,
}

var Parent = cm.SuperClass(Description)

class TestRecord2 extends Parent {

}

module.exports = TestRecord2.initClass(Description)