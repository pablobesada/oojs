//"use strict";
var cm = require('openorange').classmanager


var Description = {
    name: 'TestRecord',
    inherits: 'Record',
    fields: {
        String_Field: {type: "string", length: 60},
        Integer_Field: {type: "integer"},
    },
    filename: __filename,
}

var Parent = cm.SuperClass(Description)

class TestRecord extends Parent {

    constructor() {
        super()
        this.checkReturnValue = true;
        this.beforeInsertReturnValue = true;
        this.beforeUpdateReturnValue = true;
    }

    async check(){
        let res = await Parent.tryCall(this, true, "check");
        if (!res) return res;
        return this.checkReturnValue;
    }

    async beforeInsert(){
        let res = await Parent.tryCall(this, true, "beforeInsert");
        if (!res) return res;
        return this.beforeInsertReturnValue;
    }

    async beforeUpdate(){
        let res = await Parent.tryCall(this, true, "beforeUpdate");
        if (!res) return res;
        return this.beforeUpdateReturnValue;
    }

}

module.exports = TestRecord.initClass(Description)