"use strict";

if (typeof window == 'undefined') {
    var _ = require("underscore")
}

var BaseQuery = Object.create(null);

BaseQuery.init = function init() {
    this._type = null;
    this._fromtable = null
    this._recordClass = null
    this._projection = []
    this._where = []
    this._orderby = []
    this._limit = null
    this._offset = null
    return this;
}


BaseQuery.select = function select(recordClass) {
    var res = Object.create(this).init();
    var desc = recordClass.getDescription()
    res._type = "SELECT"
    res._recordClass = recordClass;
    res._fromtable = desc.name;
    res._projection = _(desc.fields).map(function (val, key) {return key});
    //console.log(res._projection)
    return res;
}

BaseQuery.generateSQL = function generateSQL() {
    var sql_projection = this._projection.join(", ")
    var sql_from = this._fromtable;
    var sql_order = this._orderby.join(", ");
    var sql = [this._type, sql_projection, "FROM", sql_from];
    if (sql_order) sql.push("ORDER BY", sql_order);
    if (this._limit != null) sql.push("LIMIT", this._limit);
    return {sql: sql.join(" "), values: []}
}

BaseQuery.order = function order(o) {
    if (!(o instanceof Array)) o = [o];
    this._orderby = o;
    return this;
}

BaseQuery.limit = function limit(l) {
    this._limit = l;
    console.log(this)
    return this;
}

if (typeof window == 'undefined') {
    module.exports = BaseQuery;
} else {
    window.BaseQuery = BaseQuery
}