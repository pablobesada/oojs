"use strict"
var cm = global.__main__.require('./openorange').classmanager

var Description = {
    name: 'ClientRecord',
    inherits: 'Embedded_Record',
    fields: {
        syncVersion: {type: "integer"},
    }
}

//console.log("parentclass of core::item: " + ParentClass.new().__description__.name)
var ClientRecord = cm.createClass(Description, __filename )
//console.log("parentclass of core::item: " + ParentClass.new().__description__.name)
ClientRecord.init = function init() {
    ClientRecord.__super__.init.call(this);
    return this
}

ClientRecord.load = function load() {
    return this.runInServer("load");
}

/*ClientRecord.select = function select() {
    return this.runInServer("select")
        .then(function (records) {
            var Record = classmanager.getClass("Record")
            return _(records).map(function (jsonrec) {return Record.fromJSON(jsonrec)})
        });
}*/

ClientRecord.store = function store() {
    return this.runInServer("store");
}

ClientRecord.save = function save() {
    return this.runInServer("save");
}

ClientRecord.runInServer = function runInServer(methodname, params) {
    var rec = this;
    var data = {}
    if ('__isnew__' in rec) {
        data.calltype = 'instance';
        data.self = JSON.stringify(rec.toJSON())
    } else {
        data.calltype = 'class';
        data.recordclass = this.__description__.name;
    }
    data.method = methodname;
    data.params = params != null? params : [];
    return new Promise(function (resolve, reject) {
        var url = '/runtime/record/' + methodname;
        $.ajax({
            type: "POST",
            url: url,
            contentType: 'application/json; charset=utf-8',
            dataType: "json",
            async: true,
            data: JSON.stringify(data),
            success: function (result) {
                if (!result.ok) {
                    reject(result.error);
                    return;
                }
                if (data.calltype == 'instance') {
                    classmanager.getClass("Record").fromJSON(result.self, rec)
                }
                var response = 'response' in result? result.response : null;
                resolve(response);
                return;
            },
            error: function (jqXHR, textStatus, errorThrown) {
                //console.log("en fail")
                reject(errorThrown);
            },
            complete: function () {
                //console.log("en load::complete");
            }
        });
    });
}

module.exports = ClientRecord