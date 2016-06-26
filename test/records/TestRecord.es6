"use strict";
var cm = require('openorange').classmanager
let _ = require("underscore")
let chance = require("chance")()
let moment = require("moment")


var Description = {
    name: 'TestRecord',
    inherits: 'Record',
    fields: {
        TestName: {type: "string", length: 60},
        SubTestName: {type: "string", length: 60},
        String_Field: {type: "string", length: 60},
        LinkTo_Field: {type: "string", linkto: "Customer"},
        Integer_Field: {type: "integer"},
        NonPersistent_Field: {type: "string", length:60, persistent: false},
        Date_Field: {type: "date"},
        Rows: {type: "detail", class: "TestRecordRow"},
        NonPersistent_Rows: {type: "detail", class: "NonPersistent_TestRecordRow", persistent: false}
    },
    filename: __filename,
}

let Parent = cm.SuperClass(Description)

class TestRecord extends Parent {

    constructor() {
        super()
        this.waitBeforeReturningFromCheck = 0;
        this.waitBeforeStoringRecordsInBeforeInsert = 0;
        this.checkReturnValue = true;
        this.beforeInsertReturnValue = true;
        this.beforeUpdateReturnValue = true;
        this.beforeInsert_recordsToStore = [];
    }

    async check(){
        let res = await Parent.tryCall(this, true, "check");
        if (!res) return res;
        if (this.waitBeforeReturningFromCheck > 0) await TestRecord.wait(this.waitBeforeReturningCheck);
        return this.checkReturnValue;
    }

    static wait(t) {
        return new Promise(function (resolve, reject) {
            setTimeout(function () {
                resolve()
            },t)
        });
    }
    async beforeInsert(){
        let self = this;
        let res = await Parent.tryCall(this, true, "beforeInsert");
        if (!res) return res;
        for (let i in this.beforeInsert_recordsToStore) {
            let record = this.beforeInsert_recordsToStore[i];
            if (this.waitBeforeStoringRecordsInBeforeInsert > 0) await TestRecord.wait(this.waitBeforeStoringRecordsInBeforeInsert);
            let res = await record.store();
            if (!res) throw new Error("no se pudo grabar registro dentro de beforeInsert")
        }
        return self.beforeInsertReturnValue;
    }

    async beforeUpdate(){
        let res = await Parent.tryCall(this, true, "beforeUpdate");
        if (!res) return res;
        return this.beforeUpdateReturnValue;
    }

    static fillRecordWithRandomValues(record) {
        let cls = this;
        _(record.persistentFieldNames()).forEach(function(fn) {
            let fielddef = record.fields(fn)
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
                    let v = new moment()
                    record[fn] = v
                    break;
                case 'time':
                    record[fn] = '07:04:33'
                    break;
            }
        });
        _(record.persistentDetailNames()).forEach(function (dn) {
            let detail = record[dn];
            var nrows = chance.natural({min: 4, max: 13})
            for (var j = 0; j < nrows; j++) {
                //console.log(fn)
                var row = detail.newRow()
                cls.fillRecordWithRandomValues(row)
                detail.push(row);
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

    async pasteLinkTo_Field() {
        var self = this;
        if (this.LinkTo_Field) {
            let customer = await cm.getClass("Customer").bring(this.LinkTo_Field);
            if (customer) self.String_Field = customer.Name;
        }
    }


}

module.exports = TestRecord.initClass(Description)
