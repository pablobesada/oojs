"use strict";

var BaseQuery = require("./basequery")
var db = require("./db")
var ormutils = require("./ormutils")
var cm = require("./classmanager")

var ServerQuery = Object.create(BaseQuery)

ServerQuery.fetch = function fetch() {
    var self = this;
    var sql = this.generateSQL()
    var conn = null;
    return db.getConnection()
        .then(function (newconn) {
            conn = newconn;
            console.log(sql.sql)
            return conn.query(sql.sql, sql.values)
        })
        .spread(function (rows, fields) {
            var result = [];
            for (var i=0;i<rows.length;i++) {
                var record = self._recordClass.new();
                ormutils.fill_record_with_query_result(record, rows[i], fields)
                record.setNewFlag(false);
                record.setModifiedFlag(false);
                result.push(record);
            }
            return result;
        })/*
        .then(function () {
            var funcs = [];
            record.detailNames().forEach(function (dn) {
                funcs.push(select_detail_function(conn, record, dn))
            })
            return Promise.all(funcs);
        })*/
        .then(function (result) {
            for (var i=0;i<result.length;i++) {
                result[i].syncOldFields();
            }
            return result;
        })

}

ServerQuery.fromJSON = function fromJSON(obj) {
    var query = Object.create(this)
    query._type = obj._type;
    query._fromtable = obj._fromtable
    query._recordClass = cm.getClass(obj._recordClassName)
    query._projection = obj._projection
    query._where = obj._where
    query._orderby = obj._orderby
    query._limit = obj._limit
    query._offset = obj._offset
    return query;
}

module.exports = ServerQuery