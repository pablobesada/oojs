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

ClientRecord.save = function save() {
    return this.runInServer("save");
}

ClientRecord.runInServer = function runInServer(methodname) {
    var rec = this;
    return new Promise(function (resolve, reject) {
        var url = '/runtime/' + methodname;
        $.ajax({
            type: "POST",
            url: url,
            contentType: 'application/json; charset=utf-8',
            dataType: "json",
            async: true,
            data: JSON.stringify(rec.toJSON()),
            success: function (result) {
                if (!result.ok) {
                    reject(result.error);
                    return;
                }
                console.log(result)
                classmanager.getClass("Record").fromJSON(result.rec, rec)
                resolve();
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