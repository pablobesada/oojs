"use strict";


var cm = null;
function getClassManager() {
    if (cm == null) cm = require("openorange").classmanager;
    return cm
}

var Explorer = Object.create(null)

Explorer.search__server = function search(txt) {
    var self = this;
    var res = []
    var regexp = new RegExp(txt, "i");
    return self.findAllModules()
            .then(function (modules) {
                for (var modname in modules) {
                    var module = modules[modname];
                    for (var j=0;j<module.records.length; j++) {
                        var entry = module.records[j];
                        if (entry.label.search(regexp) >= 0) res.push({type: 'Record Class', name:entry.name, label: entry.label, access: entry.access})
                    }
                    for (var j=0;j<module.reports.length; j++) {
                        var entry = module.reports[j];
                        if (entry.label.search(regexp) >= 0) res.push({type: 'Report', name:entry.name, label: entry.label, access: entry.access})
                    }
                }
                return res;
            })
}

Explorer.search__client = function search(txt) {
    var self = this;
    return new Promise(function (resolve, reject) {
        var url = '/runtime/explorer/search';
        $.ajax({
            type: "GET",
            url: url,
            contentType: 'application/json; charset=utf-8',
            async: true,
            data: {txt: txt},
            success: function (result) {
                if (!result.ok) {
                    reject(result.error);
                    return;
                }
                resolve(result.response);
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

Explorer.findAllModules = function findAllModules() {
    var Promise = require("bluebird");
    var fs = Promise.promisifyAll(require("fs"));
    var path = require("path")

    var promise = Promise.pending();
    var res = {};
    var promises = []
    for (var i=0; i<getClassManager().reversed_scriptdirs.length; i++) {
        var sd = getClassManager().reversed_scriptdirs[i];
        var folder = "./" + sd + "/modules";
        var prom = fs.readdirAsync(folder).map(function (fn) {
            var cname = path.parse(fn).name;
            if (!(cname in res)) res[cname] = cm.getClass(cname).getDescription();
        }).catch(function (err) {
            //console.log(err)
        })
        promises.push(prom)
    }
    Promise.all(promises).then(function () {
        promise.resolve(res)
    })
    return promise.promise;
}

if (typeof window == 'undefined') {
    Explorer.search = Explorer.search__server;
    module.exports = Explorer
} else {
    Explorer.search = Explorer.search__client
    window.OpenOrangeExplorer = Explorer
}
