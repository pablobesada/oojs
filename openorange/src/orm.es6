"use strict";
let _ = require("underscore")
var db = require("./db")
var async = require("async")
var Promise = require("bluebird")
var ormutils = require("./ormutils.js")
var Query = require("./serverquery.js")
let ctx = require("./contextmanager.js")


Promise.config({
    longStackTraces: true
})
var orm = {}

async function raw_insert_row_function(connection, record) {
    var insert = orm.generate_insert_sql(record);
    //console.log(insert.sql)
    let info = await connection.query(insert.sql, insert.values)
    record.internalId = info.insertId;
    await store_sets(connection, record, true, false);
    record.syncVersion = 1;
    record.setNewFlag(false);
    record.setModifiedFlag(false);
}

async function raw_delete_row_function(connection, record) {
    var del = orm.generate_delete_sql(record);
    //console.log(del.sql)
    //console.log(del.values)
    let info = await connection.query(del.sql, del.values)
    if (info.affectedRows != 1) {
        throw {code: "ROW_NOT_DELETED", message: "Row couldn't be deleted"}
        return;
    }
    await store_sets(connection, record, false, true);
}

async function raw_update_row_function(connection, record) {
    var update = orm.generate_update_sql(record);
    //console.log(update.sql)
    let info = await connection.query(update.sql, update.values)
    if (info.changedRows != 1) {
        throw {code: "ROW_NOT_UPDATED", message: "Row couldn't be updated"}
    } else {
        //console.log("raw_update_row_function SET")
        await store_sets(connection, record, false, false);
        record.setNewFlag(false);
        record.setModifiedFlag(false);
    }
}

async function deleteDetailFunction(connection, record, detailname) {
    var detail = record.details(detailname);
    var del = orm.generate_delete_detail_sql(record, detailname);
    let info = await connection.query(del.sql, del.values)
    for (let i = 0; i < detail.length; i++) {
        let row = detail[i]
        await store_sets(connection, row, row.isNew(), true)
    }
}

async function saveDetailFunction(connection, record, detailname) {
    var funcs = [];
    return new Promise(function (resolve, reject) {
        var detail = record.details(detailname);
        for (let i = 0; i < detail.length; i++) {
            let row = detail[i];
            row.masterId = record.internalId;
            row.rowNr = i;
            if (row.isModified()) {
                if (row.isNew()) {
                    funcs.push(raw_insert_row_function(connection, row))
                } else {
                    funcs.push(raw_update_row_function(connection, row))
                }
            }
        }
        for (let i = 0; i < detail.__removed_rows__.length; i++) {
            let row = detail.__removed_rows__[i];
            if (!row.isNew()) {
                funcs.push(raw_delete_row_function(connection, row))
            }
        }
        resolve();
    }).then(function () {
        return Promise.all(funcs)
    })
    /*.catch(function (err) {
     console.log(err)
     })*/
}

orm.generate_insert_sql = function generate_insert_sql(record) {
    var fieldnames = record.persistentFieldNames();
    var questions = [];
    var values = [];
    var fnames = []

    for (var i = 0; i < fieldnames.length; i++) {
        var fn = fieldnames[i];
        if (fn == 'internalId') continue;
        fnames.push("`" + fn + "`");
        questions.push("?");
        if (fn == 'syncVersion') {
            values.push(1);
        } else {
            values.push(record.fields(fn).getSQLValue());
        }
    }
    var sql = "INSERT INTO " + record.__class__.__description__.name + " (" + fnames.join(",") + ") VALUES (" + questions.join(",") + ")";
    return {sql: sql, values: values};
}

orm.generate_update_sql = function generate_update_sql(record) {
    var fieldnames = record.persistentFieldNames();
    var values = [];
    var setfields = [];
    var where = [];
    for (var i = 0; i < fieldnames.length; i++) {
        var fn = fieldnames[i];
        setfields.push("`" + fn + "`=?");
        if (fn == 'syncVersion') {
            values.push(record[fn] + 1);
        } else {
            values.push(record.fields(fn).getSQLValue());
        }
    }
    where.push("`internalId`=?");
    values.push(record.oldFields("internalId").getSQLValue());
    if (record.hasField("syncVersion")) {
        where.push("`syncVersion`=?");
        values.push(record.oldFields("syncVersion").getSQLValue());
    }
    var sql = "UPDATE " + record.__class__.__description__.name + " SET " + setfields.join(",") + " WHERE " + where.join(" AND ");
    return {sql: sql, values: values};
}

orm.generate_delete_sql = function generate_delete_sql(record) {
    var values = [];
    var where = [];
    where.push("`internalId`=?");
    values.push(record.internalId);
    if (record.hasField("syncVersion")) {
        where.push("`syncVersion`=?");
        values.push(record.syncVersion);
    }
    var sql = "DELETE FROM " + record.__class__.getDescription().name + " WHERE " + where.join(" AND ");
    return {sql: sql, values: values};
}

orm.generate_delete_detail_sql = function generate_update_sql(record, detailname) {
    var values = [];
    var where = [];
    where.push("`masterId`=?");
    values.push(record.internalId);
    var sql = "DELETE FROM " + record.details(detailname).__description__.class + " WHERE " + where.join(" AND ");
    return {sql: sql, values: values};
}

function select_detail_function2(conn, record, dn) {
    return function (cb) {
        var select = orm.generate_select_detail_sql(record, dn);
        //console.log(select.sql)
        var detail = record.details(dn);
        conn.query(select.sql, select.values, function (err, rows, fields) {
            if (err) {
                cb(err);
                return;
            }
            rows.forEach(function (row) {
                var rw = detail.newRow();
                ormutils.fill_record_with_query_result(rw, row, fields);
                detail.push(rw);
                rw.setNewFlag(false);
                rw.setModifiedFlag(false);
            })
            cb(null);
            return;
        })
    }
}

function select_detail_function(conn, record, dn) {
    var select = orm.generate_select_detail_sql(record, dn);
    //console.log(select.sql)
    var detail = record.details(dn);
    return conn.query(select.sql, select.values)
        .spread(function (rows, fields) {
            rows.forEach(function (row) {
                var rw = detail.newRow();
                ormutils.fill_record_with_query_result(rw, row, fields);
                detail.push(rw);
                rw.setNewFlag(false);
                rw.setModifiedFlag(false);
            })
        })
}


orm.load = async function load(record) {
    var conn = await ctx.getDBConnection()
    var select = orm.generate_load_sql(record);
    var qres = await conn.query(select.sql, select.values);
    var rows = qres[0], fields = qres[1];
    if (rows == 0) {
        return false;
    }
    ormutils.fill_record_with_query_result(record, rows[0], fields)
    record.setNewFlag(false);
    record.setModifiedFlag(false);

    var funcs = [];
    record.persistentDetailNames().forEach(function (dn) {
        funcs.push(select_detail_function(conn, record, dn))
    })
    await Promise.all(funcs);
    record.syncOldFields();
    return true;
}

orm.generate_load_sql = function generate_load_sql(record) {
    var fieldnames = record.persistentFieldNames();
    var questions = [];
    var values = [];
    var snames = []
    var where = []

    for (let i = 0; i < fieldnames.length; i++) {
        let fn = fieldnames[i];
        snames.push("`" + fn + "`");
        let value = record.fields(fn).getSQLValue();
        if (value != null) {
            where.push("`" + fn + "` = ?");
            values.push(value);
        }
    }
    var sql = "SELECT " + snames.join(",") + " FROM " + record.__class__.__description__.name + " WHERE " + where.join(" AND ") + " LIMIT 1";
    if (where.length == 0) {
        console.log(sql)
        throw new Error("Imposible hacer select sin valores")
    }
    return {sql: sql, values: values};
}

orm.generate_select_detail_sql = function generate_select_detail_sql(record, detailname) {
    var detail = record.details(detailname);
    var fieldnames = detail.persistentFieldNames(); 
    var questions = [];
    var values = [record.internalId];
    var snames = []
    var where = "`masterId`=?";
    var order = "rowNr ASC";

    for (var i = 0; i < fieldnames.length; i++) {
        var fn = fieldnames[i];
        snames.push("`" + fn + "`");
    }
    var sql = "SELECT " + snames.join(",") + " FROM " + detail.__description__.class + " WHERE " + where + " ORDER BY " + order;
    return {sql: sql, values: values};
}

async function save_details_and_finish_function(conn, record) {
    try {
        var funcs = [];
        await new Promise(function (resolve, reject) {
            for (var i = 0; i < record.persistentDetailNames().length; i++) {
                var f = saveDetailFunction(conn, record, record.persistentDetailNames()[i]);
                funcs.push(f);
            }
            resolve()
        });
        await Promise.all(funcs);
        return true;
    } catch (err) {
        if (err.stack) console.log(err.stack)
        return false;
    }
}

async function store_sets(conn, record, isNewRecord, isDeleting) {
    let promises = [];
    if (!isNewRecord) {
        let fieldnames = record.fieldNames()
        for (let i = 0; i < fieldnames.length; i++) {
            let field = record.fields(fieldnames[i])
            let oldvalue = record.oldFields(fieldnames[i]).getValue();
            if (field.type == 'set' && field.setrecordname && oldvalue != null && oldvalue != '' && (field.getValue() != oldvalue || isDeleting)) {
                let sql = `DELETE FROM ${field.setrecordname} WHERE masterId=?`
                let values = [record.oldFields("internalId").getValue()]
                promises.push(conn.query(sql, values));
            }
        }
    }
    if (!isDeleting) {
        let fieldnames = record.fieldNames()
        for (let i = 0; i < fieldnames.length; i++) {
            let field = record.fields(fieldnames[i])
            if (field.type == 'set' && field.setrecordname && field.getValue() != null) {
                let setvalues = _(field.getValue().split(",")).map(function (v) {
                    return v.trim()
                })
                for (let j = 0; j < setvalues.length; j++) {
                    let sql = `INSERT INTO ${field.setrecordname} (masterId, Value) values (?,?)`
                    let values = [record.internalId, setvalues[j]]
                    promises.push(conn.query(sql, values));
                }
            }
        }
    }
    return Promise.all(promises)
}

async function save_new(conn, record) {
    //await conn.beginTransaction()
    var insert = orm.generate_insert_sql(record);
    var info = await conn.query(insert.sql, insert.values)
    record.internalId = info.insertId;
    record.syncVersion = 1;
    await store_sets(conn, record, true, false);
    record.setNewFlag(false);
    record.setModifiedFlag(false);
    return save_details_and_finish_function(conn, record)
}

async function save_existing(conn, record) {
    //await conn.beginTransaction();
    let update = orm.generate_update_sql(record);
    let info = await conn.query(update.sql, update.values)
    if (info.changedRows != 1) {
        console.log({code: "WRONG_SYNCVERSION", message: "Record might have been modified by other user "})
        return false
    }
    record.syncVersion += 1;
    record.setNewFlag(false);
    await store_sets(conn, record, false, false);
    record.setModifiedFlag(false);
    return save_details_and_finish_function(conn, record);
}

function delete_details_and_finish_function(conn, record) {
    var funcs = [];
    return new Promise(function (resolve, reject) {
        for (var i = 0; i < record.persistentDetailNames().length; i++) {
            var f = deleteDetailFunction(conn, record, record.persistentDetailNames()[i]);
            funcs.push(f);
        }
        resolve();
    })
        .then(function () {
            return Promise.all(funcs)
        })
        .then(
            function () {
                record.syncOldFields()
                //return conn.commit().then(function () {
                //
                //})
            },
            function onReject(err) {
                Promise.reject(err);
            }
        )
}

orm.store = async function store(record, callback) {
    let res = true;
    if (!record.isPersistent() || (!record.isNew() && !record.isModified())) {
        return true;
    }
    try {
        //var conn = await .getConnection();
        var conn = await ctx.getDBConnection();
        if (record.isNew()) {
            let res = await save_new(conn, record);
            if (!res) return res;
        } else if (record.isModified()) {
            let res = await save_existing(conn, record);
            if (!res) return res;
        }
        //record.syncOldFields(); ya no se hace aca
    } catch (err) {
        await conn.rollback()
        if (err.stack) console.log(err.stack)
        throw err
    }
    return true;
}

orm.delete = async function (record) {
    if (record.isNew()) {
        return Promise.reject({
            code: "NOT_DELETED",
            message: "Record is new. Cannot be deleted"
        });
    }
    let conn = await ctx.getDBConnection()
    var del = orm.generate_delete_sql(record);
    let info = await conn.query(del.sql, del.values)
    if (info.affectedRows != 1) {
        throw {code: "NOT_DELETED", message: "Record might have been modified by other user."};
    }
    await store_sets(conn, record, false, true)
    return delete_details_and_finish_function(conn, record);
}

orm.select = function select(recordClass) {
    //return Query.select(recordClass)

    var conn = null;
    //return db.getConnection()
    return ctx.getDBConnection()
        .then(function (newconn) {
            conn = newconn;
            var select = orm.generate_select_sql(recordClass);
            return conn.query(select.sql, select.values)
        })
        .spread(function (rows, fields) {
            var result = []
            for (var i = 0; i < rows.length; i++) {
                var record = recordClass.new();
                ormutils.fill_record_with_query_result(record, rows[i], fields)
                result.push(record);
            }
            return result;
        })

}

orm.generate_select_sql = function generate_select_sql(record) {
    var fieldnames = record.fieldNames();
    var questions = [];
    var values = [];
    var snames = []
    var where = []

    for (var i = 0; i < fieldnames.length; i++) {
        var fn = fieldnames[i];
        snames.push("`" + fn + "`");
        var value = record[fn];
        if (value != null) {
            //where.push("`" + fn + "` = ?");
            values.push(record[fn]);
        }
    }
    var sql = "SELECT " + snames.join(",") + " FROM " + record.__description__.name; // + " WHERE " + where.join(" AND ") + " LIMIT 1";
    return {sql: sql, values: values};
}

orm.syncRecord = async function syncRecord(description) {
    if (!description.persistent) return;
    console.log("sync: ", description.name)
    let conn = await ctx.getDBConnection();
    let qres = await conn.query('SHOW TABLES LIKE ?', description.name);
    let rows = qres[0], fields = qres[1];
    if (rows.length == 0) {
        await orm.createTable(description)
    } else {
        await orm.alterTable(description)
    }
}

orm.get_db_type_name = function get_db_type_name(ftype, length) {
    let d = {
        "string": `varchar(${length})`,
        "memo": "mediumtext",
        "blob": "longblog",
        "set": `varchar(${length})`,
        "integer": "bigint(20)",
        "boolean": "tinyint(1)",
        "date": "date",
        "time": "time",
        "internalid": "integer",
        "masterid": "integer",
        "value": "double"
    }
    return d[ftype]
}

orm.column_def_sql = function column_def_sql(name, fielddef) {
    let type = orm.get_db_type_name(fielddef.type, fielddef.getMaxLength());
    let opts = (name == 'internalId') ? 'NOT NULL AUTO_INCREMENT' : 'DEFAULT NULL'
    return `${name} ${type} ${opts}`
}
orm.createTable = async function createTable(description) {
    let tablename = description.name;
    let columns = _(description.persistentFieldNames).map((fn) => {
        return orm.column_def_sql(fn, description.fields[fn])
    });
    let indexes = []
    indexes.push('PRIMARY KEY (`internalId`)');
    let sql = `CREATE TABLE ${tablename} (${columns.join(",\n")}, ${indexes.join(",\n")} ) ENGINE=InnoDB DEFAULT CHARSET=utf8`
    let conn = await ctx.getDBConnection();
    return conn.query(sql);
}

orm.alterTable = async function alterTable(description) {
    let conn = await ctx.getDBConnection();
    let qres = await conn.query('SHOW COLUMNS FROM ' + description.name);
    let rows = qres[0], queryfields = qres[1];
    let adds = [], dels = [], upds = []
    let table_current_fields = {}
    for (let i = 0; i < rows.length; i++) {
        let row = rows[i];
        table_current_fields[row.Field] = row;
        if (description.persistentFieldNames.indexOf(row.Field) < 0) {
            dels.push(row.Field)
        } else {
            let field = description.fields[row.Field]
            if (row.Type != orm.get_db_type_name(field.type, field.getMaxLength())) upds.push(row.Field);
        }
    }
    for (let i = 0; i < description.persistentFieldNames.length; i++) {
        let fn = description.persistentFieldNames[i];
        if (!(fn in table_current_fields)) adds.push(fn);
    }

    //console.log("ADDS: ", adds)
    //console.log("DELS: ", dels)
    //console.log("UPDS: ", upds)

    let tablename = description.name;
    let columns = _(adds).map((fn) => {
        return "ADD " + orm.column_def_sql(fn, description.fields[fn])
    })
    columns = columns.concat(_(upds).map((fn) => {
        return "MODIFY " + orm.column_def_sql(fn, description.fields[fn])
    }))
    //columns =  columns.concat(_(dels).map((fn) => {return "DROP " + fn})) // por el momento no vamos a eliminar columnas, xq puede haber problemas al borrar campos creador por OpenOrange Legacy y que sigan en uso
    if (columns.length) {
        let sql = `ALTER TABLE ${tablename} ${columns.join(",\n")}`
        return await conn.query(sql);
    }
    return true;
}

orm.syncSetRecord = async function syncSetRecord(setrecordname) {
    let oo = require("openorange")
    let cm = oo.classmanager
    let internalIdDesc = cm.getClass("Row").getDescription().fields.internalId
    let masterIdDesc = cm.getClass("Row").getDescription().fields.masterId
    let desc = {
        name: setrecordname,
        persistent: true,
        inherits: "Embedded_Record",
        fields: {
            internalId: internalIdDesc,
            masterId: masterIdDesc,
            Value: {type: "string", length: 30},
        }
    }
    let record= oo.BaseEntity.createFromDescription(desc);

    return orm.syncRecord(record.__class__.getDescription())
}

orm.syncAllTables = async function syncAllTables() {
    let classes = {}
    let cm = require("openorange").classmanager
    //console.log(cm.getClass("Row").getDescription())

    let scriptdirs = cm.getClassStructure();
    _(scriptdirs).each((sd) => {
        _(sd.records).each((value, key) => {
            classes[key] = 1
        })
        _(sd.documents).each((value, key) => {
            classes[key] = 1
        }) //necesario esto?
    })

    for (let classname in classes) {
        let cls = cm.getClass(classname);
        if (cls.getDescription().persistent) await orm.syncRecord(cls.getDescription())
        _(cls.getDescription().persistentFieldNames).each(async (f) => {
            if (f.setrecordname) {
                await orm.synSetRecord(f.recordname);
            }
        })
    }
    return true;
}

module.exports = orm