"use strict"


var ClientQuery = Object.create(BaseQuery)

ClientQuery.fetch = function fetch() {
    return new Promise(function (resolve, reject) {
        var url = '/runtime/query/fetch' + methodname;
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


window.ClientQuery = ClientQuery; //para hacer global la variable ClientQuery