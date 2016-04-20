"use strict";
var db = require("./db")

var orm = {}

orm.save = function save(record, callback) {
    if (!record.isNew() && !record.isModified()) {
        callback();
        return;
    }
    db.pool.getConnection(function(err,conn) {
        if (err) {
            if (conn) conn.release();
            callback(err, null);
            return;
        }
        if (record.isNew()) {
            var insert = orm.generate_insert_sql(record);
            console.log(insert.sql)
            conn.query(insert.sql, insert.values, function(err,info){
                if (conn) conn.release();
                if (!err) {
                    record.internalId = info.insertId;
                    record.syncVersion = 1;
                    record.setNewFlag(false);
                    record.setModifiedFlag(false);
                }
                callback(err);
                return;
            })
        } else if (record.isModified()) {
            var update = orm.generate_update_sql(record);
            console.log(update.sql)
            conn.query(update.sql, update.values, function(err,info){
                if (conn) conn.release();
                if (!err) {
                    if (info.changedRows != 1) {
                        callback({code: "WRONG_SYNCVERSION", message: "Record might have been modified by other user"})
                        return;
                    } else {
                        record.syncVersion += 1;
                        record.setNewFlag(false);
                        record.setModifiedFlag(false);
                    }
                }
                callback(err);
                return;
            })
        }
    });
}

orm.generate_insert_sql = function generate_insert_sql(record) {
    var fieldnames = record.fieldNames();
    var questions = [];
    var values = [];
    var fnames = []

    for (var i=0;i<fieldnames.length;i++) {
        var fn = fieldnames[i];
        if (fn == 'internalId') continue;
        fnames.push("`" + fn  +"`");
        questions.push("?");
        if (fn == 'syncVersion') {
            values.push(1);
        } else {
            values.push(record[fn]);
        }
    }
    var sql = "INSERT INTO " + record.__description__.name + " (" + fnames.join(",") + ") VALUES (" + questions.join(",") + ")";
    return {sql: sql, values: values};
}

orm.generate_update_sql = function generate_update_sql(record) {
    var fieldnames = record.fieldNames();
    var values = [];
    var setfields = [];
    var where = [];
    for (var i=0;i<fieldnames.length;i++) {
        var fn = fieldnames[i];
        setfields.push("`" + fn  +"`=?");
        if (fn == 'syncVersion') {
            values.push(record[fn]+1);
        } else {
            values.push(record[fn]);
        }
    }
    where.push("`internalId`=?"); values.push(record.internalId);
    where.push("`syncVersion`=?"); values.push(record.syncVersion);
    var sql = "UPDATE " + record.__description__.name + " SET " + setfields.join(",") + " WHERE " + where.join(" AND ");
    return {sql: sql, values: values};
}

orm.load = function load(record, callback) {
    db.pool.getConnection(function(err,conn) {
        if (err) {
            if (conn) conn.release();
            callback(err, null);
            return;
        }
        if (record.isNew()) {
            var select = orm.generate_select_sql(record);
            console.log(select.sql);
            conn.query(select.sql, select.values, function(err,rows, fields) {
                if (conn) conn.release();
                if (err) {
                    callback(err);
                    return;
                }
                if (rows == 0) {
                    callback({error: "record not found"})
                    return;
                }
                for (var i=0;i<fields.length;i++) {
                    var fn = fields[i].name;
                    console.log("value for " + fn + ": " + rows[0][fn])
                    record[fn] = rows[0][fn];
                }
                record.setNewFlag(false);
                record.setModifiedFlag(false);
                callback(null);
                return;
            })
        }
    });
}

orm.generate_select_sql = function generate_select_sql(record) {
    var fieldnames = record.fieldNames();
    var questions = [];
    var values = [];
    var snames = []
    var where = []

    for (var i=0;i<fieldnames.length;i++) {
        var fn = fieldnames[i];
        snames.push("`" + fn  +"`");
        var value = record[fn];
        if (value != null) {
            where.push("`" + fn  +"` = ?");
            values.push(record[fn]);
        }
    }
    var sql = "SELECT " + snames.join(",") + " FROM " + record.__description__.name + " WHERE " + where.join(" AND ") + " LIMIT 1";
    return {sql: sql, values: values};
}

module.exports = orm