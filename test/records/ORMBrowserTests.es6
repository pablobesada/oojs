"use strict";
let oo = require("openorange")
let _ = require("underscore")

class ORMBrowserTests {
    static async test1 () {
        let cls = oo.classmanager.getClass("TestRecord")
        let cls2 = oo.classmanager.getClass("TestRecord2")
        let rec = cls.new().fillWithRandomValues();
        rec.beforeInsertReturnValue = true;
        rec.SubTestName = 'TEST'
        for (let i=0;i<3;i++) {
            let record = cls2.new().fillWithRandomValues()
            record.SubTestName = rec.SubTestName
            rec.beforeInsert_recordsToStore.push(record);
        }
        let res = await rec.save();
        console.log(res)
        if (res) await oo.commit()
        let response = {should_exist: [], should_not_exist: []}
        let saved_recs = _(rec.beforeInsert_recordsToStore).map(function (r) {return JSON.stringify(r.toJSON())});
        saved_recs.push(JSON.stringify(rec.toJSON()));
        if (res) {
            response.should_exist = saved_recs
        } else {
            response.should_not_exist = saved_recs
        }
        return response
    }
}

ORMBrowserTests.__description__ = {filename: __filename}
module.exports = ORMBrowserTests;