"use strict";

(function () {
    let oo = require("openorange")
    var ClientQuery = Object.create(oo.__basequery__)

    var _Record = null

    function getRecordClass() {
        if (_Record == null) _Record = require("openorange").classmanager.getClass("Record") //este require lo tengo que hacer aca porque si lo hago afuera (arriba) hay una refencia circular, ya que openorange.js necesita que clientquery ya este definido xq lo usa
        return _Record;
    }

    ClientQuery.fetch = function fetch() {
        var self = this;
        return new Promise(function (resolve, reject) {
            var url = oo.baseurl + '/query/fetch';
            $.ajax({
                type: "POST",
                url: url,
                contentType: 'application/json; charset=utf-8',
                dataType: "json",
                async: true,
                data: JSON.stringify(self.toJSON()),
                success: function (result) {
                    if (!result.ok) {
                        reject(result.error);
                        return;
                    }
                    var Record = getRecordClass();
                    var records = _(result.response).map(function (jsonrec) {
                        return Record.fromJSON(jsonrec)
                    })
                    resolve(records);
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

    //window.ClientQuery = ClientQuery; //para hacer global la variable ClientQuery
    $.extend(true, window.oo, {query: ClientQuery})
})();
