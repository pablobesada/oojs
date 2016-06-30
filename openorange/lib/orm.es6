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

function raw_insert_row_function(connection, record) {
    var insert = orm.generate_insert_sql(record);
    //console.log(insert.sql)
    return connection.query(insert.sql, insert.values)
        .then(function (info) {
            record.internalId = info.insertId;
            record.syncVersion = 1;
            record.setNewFlag(false);
            record.setModifiedFlag(false);
        })
}

function raw_delete_row_function(connection, record) {
    var del = orm.generate_delete_sql(record);
    //console.log(del.sql)
    //console.log(del.values)
    return connection.query(del.sql, del.values)
        .then(function (info) {
            if (info.affectedRows != 1) {
                throw {code: "ROW_NOT_DELETED", message: "Row couldn't be deleted"}
                return;
            }
        })
}

function raw_update_row_function(connection, record) {
    var update = orm.generate_update_sql(record);
    //console.log(update.sql)
    return connection.query(update.sql, update.values)
        .then(function (info) {
            if (info.changedRows != 1) {
                throw {code: "ROW_NOT_UPDATED", message: "Row couldn't be updated"}
            } else {
                record.setNewFlag(false);
                record.setModifiedFlag(false);
            }
        })
}

function deleteDetailFunction(connection, record, detailname) {
    var detail = record.details(detailname);
    var del = orm.generate_delete_detail_sql(record, detailname);
    //console.log(del.sql)
    //console.log(del.values)
    return connection.query(del.sql, del.values)
}

function saveDetailFunction(connection, record, detailname) {
    var funcs = [];
    return new Promise(function (resolve, reject) {
        var detail = record.details(detailname);
        for (var i = 0; i < detail.length; i++) {
            var row = detail[i];
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
        for (var i = 0; i < detail.__removed_rows__.length; i++) { 
            var row = detail.__removed_rows__[i];
            if (!row.isNew()) {
                funcs.push(raw_delete_row_function(connection, row))
            }
        }
        resolve();
    }).then(function () {
        return Promise.all(funcs)
    })
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

orm.generate_delete_sql = function generate_update_sql(record) {
    var values = [];
    var where = [];
    where.push("`internalId`=?");
    values.push(record.internalId);
    if (record.hasField("syncVersion")) {
        where.push("`syncVersion`=?");
        values.push(record.syncVersion);
    }
    var sql = "DELETE FROM " + record.__description__.name + " WHERE " + where.join(" AND ");
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
    try {
        //var conn = await db.getConnection()
        var conn = await ctx.getDBConnection()
        var select = orm.generate_load_sql(record);
        //console.log(select.sql)
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
        //conn.release();
        //conn = null;
        record.syncOldFields();
        return true;
    } finally {
        //if (conn != null) {
        //    conn.release()
        //    conn = null;
        //console.log(err, conn)
        //}
    }
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
    var fieldnames = detail.fieldNames();
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
        //await conn.commit();
        return true;
    } catch (err) {
        //await conn.rollback(conn);
        return false;
    }
}

async function storeSets(conn, record) {
    let promises = [];
    if (!record.isNew()) {
        let fieldnames = record.fieldNames()
        for (let i=0;i<fieldnames.length;i++) {
            let field = record.fields(fieldnames[i])
            let oldvalue = record.oldFields(fieldnames[i]).getValue();
            if (field.type == 'set' && field.setrecordname && field.getValue() != oldvalue && oldvalue != null && oldvalue != '') {
                let sql = `DELETE FROM ${field.setrecordname} WHERE masterId=?`
                let values = [record.oldFields("internalId").getValue()]
                promises.push(conn.query(sql, values));
            }
        }
    }
    let fieldnames = record.fieldNames()
    for (let i=0;i<fieldnames.length;i++) {
        let field = record.fields(fieldnames[i])
        if (field.type == 'set' && field.setrecordname && field.getValue() != null) {
            let setvalues = _(field.getValue().split(",")).map(function (v) {return v.trim()})
            for (let j=0;j<setvalues.length;j++) {
                let sql = `INSERT INTO ${field.setrecordname} (masterId, Value, syncVersion) values (?,?,?)`
                let values = [record.internalId, setvalues[j], 1]
                promises.push(conn.query(sql, values));
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
    await storeSets(conn, record);
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
    await storeSets(conn, record);
    record.setModifiedFlag(false);
    return save_details_and_finish_function(conn, record);
}

function delete_details_and_finish_function(conn, record) {
    var funcs = [];
    return new Promise(function (resolve, reject) {
        for (var i = 0; i < record.detailNames().length; i++) {
            var f = deleteDetailFunction(conn, record, record.detailNames()[i]);
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
        throw err
    }
    return true;
}

orm.delete = function (record) {
    if (record.isNew()) {
        return Promise.reject({
            code: "NOT_DELETED",
            message: "Record is new. Cannot be deleted"
        });
    }
    var conn = null;
    //return db.getConnection()
    return ctx.getDBConnection()
    then(function (newconn) {
        conn = newconn
        //return conn.beginTransaction();
        //}).then(function () {
        var del = orm.generate_delete_sql(record);
        //console.log(del.sql)
        //console.log(del.values)
        return conn.query(del.sql, del.values)
    }).then(function (info) {
        //console.log(info)
        if (info.affectedRows != 1) {
            //console.log(info.affectedRows)
            throw {code: "NOT_DELETED", message: "Record might have been modified by other user."};
        }
        return delete_details_and_finish_function(conn, record);
    }).finally(function (err) {
        //if (conn != null) {
        //    conn.release()
        //    conn = null;
        //    //console.log(err, conn)
        // }
    })
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

module.exports = orm