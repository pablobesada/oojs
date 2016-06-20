"use strict"
var cm = require('openorange').classmanager

var Description = {
    name: 'ClientRecord',
    inherits: 'Embedded_Record',
    fields: {
        syncVersion: {type: "integer"},
    },
    filename: __filename
}

var Parent = cm.SuperClass(Description)

class ClientRecord extends Parent {
    constructor() {
        super()
    }

    async load() {
        return this.runInServer("load");
    }

    async store() {
        return this.runInServer("store");
    }

    async save() {
        //return this.runInServer("save");
        // por ahora vamos al servidor solo en el store. ojo que si vamos al servidor con el save, hay que tener en cuenta:
            // 1. save de registros locals
            // 2. alerts, mensajes y inputs al usuario durante el proceso de grabado
    }

    async runInServer(methodname, params) {
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
        data.params = params != null ? params : [];
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
                    var response = 'response' in result ? result.response : null;
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
}

module.exports = ClientRecord.initClass(Description)