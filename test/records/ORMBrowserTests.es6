"use strict";
let oo = require("openorange")
let _ = require("underscore")

class ORMBrowserTests {
    static async test1 (t,bir, cb) {
        let cls = oo.classmanager.getClass("TestRecord")
        let cls2 = oo.classmanager.getClass("TestRecord2")
        let rec = cls.new().fillWithRandomValues();
        rec.waitBeforeReturningFromCheck = 2000;
        rec.waitBeforeStoringRecordsInBeforeInsert = 2000;
        for (let i in rec.Rows) rec.Rows[i].String_Field = 'ROW ' + t;
        rec.beforeInsertReturnValue = bir;
        rec.SubTestName = 'TEST ' + t;
        for (let i=0;i<3;i++) {
            let record = cls2.new().fillWithRandomValues()
            record.SubTestName = rec.SubTestName
            rec.beforeInsert_recordsToStore.push(record);
        }
        let response = {should_exist: [], should_not_exist: []}
        let saved_recs = _(rec.beforeInsert_recordsToStore).map(function (r) {return JSON.stringify(r.toJSON())});
        saved_recs.push(JSON.stringify(rec.toJSON()));
        if (bir) {
            response.should_exist = saved_recs
        } else {
            response.should_not_exist = saved_recs
        }
        cb(response)
        let res = await rec.save();
        console.log(res)
        if (res) await oo.commit()
    }

}

ORMBrowserTests.__description__ = {filename: __filename}
module.exports = ORMBrowserTests;