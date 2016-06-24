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
    res._projection = _(desc.fieldnames).map(function (val) {return val});
    //console.log(res._projection)
    return res;
}

BaseQuery.generateSQL = function generateSQL() {
    var sql_projection = this._projection.join(", ")
    var sql_from = this._fromtable;
    var sql_order = this._orderby.join(", ");
    var sql_where = this._where.join(" AND ");
    var sql = [this._type, sql_projection, "FROM", sql_from];
    if (sql_where) sql.push("WHERE", sql_where);
    if (sql_order) sql.push("ORDER BY", sql_order);
    if (this._limit == null && this._offset != null) this._limit = 99999999999999
    if (this._limit != null) sql.push("LIMIT", this._limit);
    if (this._offset != null) sql.push("OFFSET", this._offset);
    return {sql: sql.join(" "), values: []}
}

BaseQuery.order = function order(o, direction) {
    if (direction == null) direction = 'ASC'
    this._orderby = [o + " " + direction];
    return this;
}

BaseQuery.limit = function limit(l) {
    this._limit = l;
    return this;
}

BaseQuery.offset = function offset(o) {
    this._offset = o;
    return this;
}

BaseQuery.toJSON = function toJSON() {
    var obj = {}
    obj._type = this._type;
    obj._fromtable = this._fromtable
    obj._recordClassName = this._recordClass.getDescription().name;
    obj._projection = this._projection
    obj._where = this._where;
    obj._orderby = this._orderby
    obj._limit = this._limit
    obj._offset = this._offset;
    return obj
}

BaseQuery.where = function where(w){
    var self = this;
    for (var c in w) {
        var colname = c;
        var op = '=';
        var cc = c.split("__");
        if (cc.length == 2) {
            switch(cc[1].toUpperCase()) {
                case 'LIKE':
                    colname = cc[0];
                    op = 'LIKE';
                    break;
                case 'GT':
                    colname = cc[0];
                    op = '>=';
                    break;
            }
        }

        self._where.push(colname + " " + op + " '" + w[c] + "'")
    }
    return self
}

if (typeof window == 'undefined') {
    module.exports = BaseQuery;
} else {
    //window.BaseQuery = BaseQuery
    $.extend(true, window.oo, {__basequery__: BaseQuery})
}