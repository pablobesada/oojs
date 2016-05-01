"use strict";
var ClientTools = {}
ClientTools.always_run_in_server_promise = function always_run_in_server(obj, funcname) {
    var oo = require("./openorange")
    if (oo.isClient) {
        var func = obj[funcname];
        obj[funcname] = function () {
            var rec = this;
            return new Promise(function (resolve, reject)
            {
                var url = 'localhost:///runtime/' + funcname;
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
    }
}

module.exports = ClientTools