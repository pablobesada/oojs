"use strict";
//var app = require("./../../app")
var chance = new require("chance")();
var _ = require("underscore")
var oo = require("openorange")
var query = oo.query;
var cm = oo.classmanager
var should = require('should');
var async = require('async')
var moment = require('moment')

describe("Embedded_Record", function () {
    before(async ()=> {
        try {
            let q = await oo.getDBConnection()
            await q.query("delete from TestRecord")
            await q.query("delete from TestRecordSet_Field")
            await q.query("delete from TestRecordRowSet_Field")
            await q.query("delete from TestRecordRow")
            await q.query("delete from TestRecord2")
            oo.commit();
        } catch (err) {
            console.log(err.stack)
            throw err
        }
    });

    let cls = cm.getClass("TestRecord");
    let cls2 = cm.getClass("TestRecord2");
    let rec = null;
    let original_rec = null;

    beforeEach(async () => {
        await oo.beginTransaction();
    })
    after(async () => {
        await oo.commit();
    })

    it("isModified", async () => {
        rec = cls.new().fillWithRandomValues();
        //console.log("--------------------------")
        rec.setModifiedFlag(false)
        rec.isModified().should.be.false();
        rec.String_Field = 'ABCD'
        rec.isModified().should.be.true('isModified not right after setting header value');
        rec.setModifiedFlag(false)
        rec.Rows[0].Integer_Field++
        rec.isModified().should.be.true('isModified not right after settings row field value');
    })

    it("create new record and set some field values", async () => {
        rec = cls.new();
        rec.String_Field = 'ABCD'
        let now = moment([2014,4-1,3]);
        rec.Date_Field = now
        should(rec.String_Field).be.equal('ABCD');
        should(rec.Date_Field.isSame(now)).ok()
    });

    it("Linkto fields must get its length from the linked record", async () => {
        rec = cls.new();
        let linkto_class = rec.fields("LinkTo_Field").getLinktoRecordClass()
        should(rec.fields("LinkTo_Field").getMaxLength()).be.equal(linkto_class.getDescription().fields[linkto_class.uniqueKey()[0]].length)
        should(rec.fields("String_Field").getMaxLength()).be.equal(cls.getDescription().fields.String_Field.length)
    });

    it("create new record and store it", async () => {
        rec = cls.new().fillWithRandomValues()
        let res = await rec.store();
        res.should.be.true();
        original_rec = rec.clone();
    })

    it("control for non-persistent fields", async () => {
        rec = cls.new().fillWithRandomValues()
        rec.NonPersistent_Field = "esto no deberia persistir"
        let row = rec.NonPersistent_Rows.newRow();
        cls.fillRecordWithRandomValues(row)
        rec.NonPersistent_Rows.push(row)
        let res = await rec.store();
        res.should.be.true();
        let loaded_rec = await cls.findOne({internalId: rec.internalId})
        should(loaded_rec.NonPersistent_Field).be.null();
        should(loaded_rec.Rows.length).be.greaterThan(0);
        should(loaded_rec.NonPersistent_Rows.length).be.equal(0);
    })

    it("load", async () => {
        rec = cls.new()
        rec.internalId = original_rec.internalId;
        rec.Date_Field = original_rec.Date_Field;
        console.log(original_rec.Date_Field)
        var res = await rec.load();
        res.should.be.true("no se grabo");
        original_rec.syncOldFields();
        rec.isEqual(original_rec).should.be.true("registros diferentes");
    })

    it("Concurrent store (storing with old syncVersion)", async () => {
        let r1 = await cls.newSavedRecord();
        let r2 = await cls.findOne({internalId: r1.internalId})
        should(r1.isEqual(r2)).be.true()
        r1.String_Field = 'r1'
        r1.Integer_Field++;
        should(await r1.store()).ok()
        r2.Integer_Field--;
        r2.String_Field = 'r2'
        should(await r2.store()).not.ok()
    })

    it("Detail integrity against master syncVersion", async () => {
        let r1 = await cls.newSavedRecord();
        let r2 = await cls.findOne({internalId: r1.internalId})
        should(r1.isEqual(r2)).be.true()
        console.log(r1)
        console.log(r1.Rows)
        console.log(r1.Rows.length)
        r1.Rows[0].Integer_Field++;
        should(await r1.store()).ok()
        r2.Rows[0].Integer_Field--;
        should(await r2.store()).not.ok()

    })

    it("Save new OK", async ()=> {
        rec = cls.new().fillWithRandomValues()
        should(await rec.save()).be.true("El save no grabo")
        should.exist(await cls.findOne({internalId: rec.internalId, Integer_Field: rec.Integer_Field}), "El save devolvio true, pero el registro no esta en la DB")
    })

    it("Save with Check fail", async ()=> {

        let internalId = rec.internalId;
        rec = await cls.findOne({internalId: rec.internalId})
        should.exist(rec);
        rec.checkReturnValue = false;
        rec.Integer_Field++;
        let res = await rec.save()
        res.should.be.false("El save grabo y no deberia haberse grabado")
        should.not.exist(await cls.findOne({internalId: rec.internalId, Integer_Field: rec.Integer_Field}), "El save devolvio false, pero igual grabo el registro")
    })

    it("Save with beforeInsert fail", async ()=> {
        let rec = cls.new().fillWithRandomValues()
        rec.beforeInsertReturnValue = false;
        let recs_to_insert = [];
        for (let i=0;i<3;i++) {
            let record = cls.new().fillWithRandomValues()
            record.SubTestName = "Save with beforeInsert fail"
            recs_to_insert.push(record)
        }
        rec.setBeforeInsert_recordsToStore(recs_to_insert);
        rec.SubTestName = 'PARENT'
        let res = await rec.save()
        should(res).be.false("No deberia haber grabado")
        should.not.exist(await cls.findOne({String_Field: rec.String_Field}), "El save devolvio false, pero igual grabo el registro")
        recs_to_insert = rec.getBeforeInsert_recordsToStore()
        for (let i in recs_to_insert) {
            let record = recs_to_insert[i]
            should.not.exist(await cls.findOne({internalId: record.internalId, String_Field: record.String_Field}), "El save devolvio false, pero igual grabo registros dentro del beforeInsert")
        }
    });

    it("Save with beforeUpdate fail", async ()=> {
        let rec = cls.new().fillWithRandomValues()
        rec.beforeUpdateReturnValue = false;

        let res = await rec.save()
        should(res).be.true("Deberia haber grabado");
        rec.Integer_Field++;

        res = await rec.save();

        should(res).be.false("No Deberia haber grabado");
        should.not.exist(await cls.findOne({internalId: rec.internalId, Integer_Field: rec.Integer_Field}), "El save devolvio false, pero igual grabo el registro")
    })

    it ("Check if it makes rollback when storing record with wrong fields", async () => {
        //cls.__description__.fields['DUMMY'] = {type: "string", length: 30}
        //cls.__description__.fieldnames.push("DUMMY")
        let rec = cls.new().fillWithRandomValues();
        rec.beforeInsertReturnValue = false;
        rec.SubTestName = 'TEST'
        let recs_to_insert = []
        for (let i=0;i<3;i++) {
            let record = cls2.new().fillWithRandomValues()
            record.SubTestName = rec.SubTestName
            recs_to_insert.push(record);
        }
        rec.setBeforeInsert_recordsToStore(recs_to_insert)
        let res = await rec.save();
    });

    it("delete record")

    it("delete record check details and sets are gone")


    it("check serialization", async () => {
        let rec = cls.new().fillWithRandomValues();
        should(cls.fromJSON(JSON.stringify(rec.toJSON())).isEqual(rec)).be.ok();
        rec.newproperty = 'abcde'
    })

    it("check sets behaviour (adding, changing, deleting)", async () => {
        async function checkSetField(rec, fn, msg) {
            let setvalues = _(rec[fn].split(",")).map(function (v) {return v.trim()})
            let response = await (await oo.getDBConnection()).query(`SELECT Value FROM ${rec.fields(fn).setrecordname} WHERE masterId=?`, [rec.internalId])
            let rset = response[0]
            should(rset.length).be.equal(setvalues.length ,msg)
            for (let i=0;i<setvalues.length;i++) {
                should(rset[i].Value).be.equal(setvalues[i], msg)
            }
        }
        async function checkSetFieldDeleted(rec, fn) {
            let response = await (await oo.getDBConnection()).query(`SELECT COUNT(*) as CNT FROM ${rec.fields(fn).setrecordname} WHERE masterId=?`, [rec.internalId])
            let rset = response[0]
            should(rset[0].CNT).be.equal(0)
        }
        //Aca empieza: creo un registro y le seteo el Set_Field al encabezado y a las filas. Luego lo grabo y compruebo que se hayan creado bien los registros set asociados
        //A su vez luego de chequear, modifico los campos sets para la siguiente comprobacion, elimino la primera fila y agrego una nueva al final
        rec = cls.new().fillWithRandomValues()
        let res = await rec.store();
        res.should.be.true();
        await checkSetField(rec, 'Set_Field', "A");
        rec.Set_Field = chance.sentence({words: 2}).replace(/ /g, ",").replace(/\./g, "")
        for (let i=0;i<rec.Rows.length;i++) {
            let row = rec.Rows[i];
            await checkSetField(row, 'Set_Field', "B")
            row.Set_Field = chance.sentence({words: 3}).replace(/ /g, ",").replace(/\./g, "")
        }
        let removed_row = rec.Rows[0];
        rec.Rows.splice(0,1);
        rec.Rows.push(cls.fillRecordWithRandomValues(rec.Rows.newRow()))
        //grabo nuevamente el registro sin la primera fila y con una nueva fila al final. Con todos los campos Set_Field modificados (encabezado y filas)
        //compruebo que los registros asociados esten correctos (que se hayan borrado todos y creado solo los modificados y nuevos)
        res = await rec.store();
        res.should.be.true();

        await checkSetField(rec, 'Set_Field', "C");
        for (let i=0;i<rec.Rows.length;i++) {
            let row = rec.Rows[i];
            await checkSetField(row, 'Set_Field', "D")
        }
        await checkSetFieldDeleted(removed_row, 'Set_Field')
        //Ahora guardo en una lista todos los registros grabados en DB: encabezado y rows. Luego borro el registro
        //Compruebo que efectivamete todos los registros asociados a encabezado y rows se eliminaron
        let removed_recs = _(rec.Rows).map(function (r) {return r})
        removed_recs.push(rec)
        res = await rec.delete();
        for (let i=0;i<removed_recs.length; i++) {
            await checkSetFieldDeleted(removed_recs[i], 'Set_Field')
        }
    })
});

