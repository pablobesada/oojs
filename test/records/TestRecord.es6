//"use strict";
var cm = require('openorange').classmanager
let _ = require("underscore")
let chance = require("chance")()


var Description = {
    name: 'TestRecord',
    inherits: 'Record',
    fields: {
        TestName: {type: "string", length: 60},
        SubTestName: {type: "string", length: 60},
        String_Field: {type: "string", length: 60},
        Integer_Field: {type: "integer"},
        Rows: {type: "detail", class: "TestRecordRow"}
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
        this.beforeInsert_recordsToStore = [];
    }

    async check(){
        let res = await Parent.tryCall(this, true, "check");
        if (!res) return res;
        return this.checkReturnValue;
    }

    async beforeInsert(){
        let res = await Parent.tryCall(this, true, "beforeInsert");
        if (!res) return res;
        for (let i in this.beforeInsert_recordsToStore) {
            let record = this.beforeInsert_recordsToStore[i];
            let res = await record.store();
            if (!res) throw new Error("no se pudo grabar registro dentro de beforeInsert")
        }
        return this.beforeInsertReturnValue;
    }

    async beforeUpdate(){
        let res = await Parent.tryCall(this, true, "beforeUpdate");
        if (!res) return res;
        return this.beforeUpdateReturnValue;
    }

    static fillRecordWithRandomValues(record) {
        let cls = this;
        var fields = record.__class__.getDescription().fields
        _(fields).forEach(function(fielddef, fn) {
            if (fn == 'internalId') return;
            if (fn == 'masterId') return;
            if (fn == 'rowNr') return;
            switch (fielddef.type) {
                case 'string':
                    record[fn] = chance.word({length: fielddef.length});
                    break;
                case 'integer':
                    record[fn] = chance.integer({min: -10000, max: 10000});
                    break;
                case 'date':
                    record[fn] = moment()
                    break;
                case 'time':
                    //record[fn] = moment()
                    record[fn] = '07:04:33'
                    break;
                case 'detail':
                    var nrows = chance.natural({min: 4, max: 13})
                    for (var j=0;j<nrows;j++) {
                        //console.log(fn)
                        var row = record[fn].newRow()
                        cls.fillRecordWithRandomValues(row)
                        record[fn].push(row);
                    }
            }
        });
        return record;
    }

    fillWithRandomValues() {
        return this.__class__.fillRecordWithRandomValues(this);
    }

    static async newSavedRecord() {
        let rec = this.new().fillWithRandomValues();
        if (await rec.store()) return rec;
        return null;

    }

}

module.exports = TestRecord.initClass(Description)