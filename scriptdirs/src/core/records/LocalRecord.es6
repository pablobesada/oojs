"use strict"
var cm = require('openorange').classmanager
let _ = require("underscore")

let Description = {
    name: 'LocalRecord',
    inherits: 'Record',
    filename: __filename,
    persistent: false,
}

var Parent = cm.SuperClass(Description)

class LocalRecord extends Parent {
    static initClass(description) {
        super.initClass(description)
        this.__storage_table_name__ = 'oo_table_' + this.__description__.name;
        this.__records__ = []
        this.__fetched__ = false;
        return this
    }

    static getTableName() {
        return this.__storage_table_name__
    }

    static getAllRecords() {
        if (!this.__fetched__) this.__fetchRecords__();
        return this.__records__;
    }

    static checkFetched() {
        if (!this.__class__.__fetched__) this.__class__.__fetchRecords__();
    }

    static __fetchRecords__() {
        let cls = this
        let s = localStorage.getItem("oo_table_" + this.__description__.name);
        if (s == null) {
            s = JSON.stringify(LocalRecord.records);
            localStorage.setItem(this.getTableName(), s)
        }
        //var records =  _(result.response).map(function (jsonrec) {return Record.fromJSON(jsonrec)})
        let json = JSON.parse(s)
        this.__records__ = _(json).map(function (jsonrec) {return cls.fromJSON(jsonrec)})
        this.__fetched__ = true;
    }

    static __updateStorage__() {
        let cls = this;
        let s = JSON.stringify(_(cls.__records__).map(function (rec) {return rec.toJSON()}))
        localStorage.setItem(this.getTableName(), s)
    }

    constructor() {
        super()
    }

    load() {
        let records = this.__class__.getAllRecords();
        let whereClause = {}
        for (let i in this.fieldNames()) {
            let fn = this.fieldNames()[i];
            if (this[fn] != null) whereClause[fn] = this[fn]
        }
        if (whereClause == {}) return false;
        for (let i in records) {
            let record = records[i];
            let found = true;
            for (let fn in whereClause) {
                if (record[fn] != whereClause[fn]) {
                    found = false;
                    break;
                }
            }
            if (found) {
                LocalRecord.fromJSON(record.toJSON(), this) //medio feo, pero efectivo
                this.syncOldFields()
                return true;
            }
        }
        return false;
    }

    async store() {
        if (!this.isNew() && !this.isModified()) return true;
        let records = this.__class__.getAllRecords()
        if (this.isNew()) {
            records.push(this);
            this.internalId = records.length;
            this.syncVersion++;
            this.setNewFlag(false)
        } else {
            let updated = false;
            for (let i=0;i<records.length; i++) {
                if (records[i].internalId == this.internalId) {
                    this.syncVersion++;
                    records[i] = this;
                    updated = true;
                    break;
                }
            }
            if (!updated) {
                console.log("No se pudo actualizar el registro local", this)
                return false;
            }
        }
        this.__class__.__records__ = records;
        this.__class__.__updateStorage__();
        this.syncOldFields();
        return true;
    }

    async save() {
        return super.save()
    }

}

module.exports = LocalRecord.initClass(Description)