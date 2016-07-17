"use strict";


var cm = null;
function getClassManager() {
    if (cm == null) cm = require("openorange").classmanager;
    return cm
}

var Explorer = Object.create(null)

Explorer.search__server = async function search(txt) {
    var self = this;
    var res = []
    var regexp = new RegExp(txt, "i");
    let modules = await self.findAllModules();
    for (let modname in modules) {
        if (modname == 'ALL') continue //por ahora
        var module = modules[modname];
        for (let j=0;j<module.records.length; j++) {
            var entry = module.records[j];
            if (entry.label.search(regexp) >= 0) res.push({type: 'Record Class', name:entry.name, label: entry.label, access: entry.access})
        }
        for (let j=0;j<module.reports.length; j++) {
            var entry = module.reports[j];
            if (entry.label.search(regexp) >= 0) res.push({type: 'Report', name:entry.name, label: entry.label, access: entry.access})
        }
    }
    return res;
}

Explorer.search__client = function search(txt) {
    var self = this;
    return new Promise(function (resolve, reject) {
        var url = require('openorange').baseurl + '/explorer/search';
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
    var fs = require("fs");
    var path = require("path")
    var res = {ALL: {records: {}, windows: {}, cards: {}, documents: {}, reports: {}, routines: {}, tools: {}}};
    function searchFolder(sd, lookupdir) {
        var folder = "scriptdirs/lib/" + sd + "/" + lookupdir;
        let promise = Promise.pending();
        fs.readdir(folder, function (err, files)  {
            if (err) {
                promise.resolve();
                return;
            };
            if (lookupdir == 'modules') {
                for (let i=0;i<files.length;i++) {
                    let filename = files[i];
                    if (!filename.endsWith(".js")) continue;
                    var cname = path.parse(filename).name;
                    if (!(cname in res)) res[cname] = cm.getClass(cname).getDescription();
                }
            } else {
                for (let i=0;i<files.length;i++) {
                    let filename = files[i];
                    if (!filename.endsWith(".js")) continue;
                    var cname = path.parse(filename).name;
                    if (!(cname in res.ALL[lookupdir])) res.ALL[lookupdir][cname] = cname;
                }
            }
            promise.resolve();
        });
        return promise.promise;
    }

    let promise = Promise.pending();

    let promises = []
    for (let i=0; i<getClassManager().reversed_scriptdirs.length; i++) {
        var sd = getClassManager().reversed_scriptdirs[i];
        let lookupdirs = getClassManager().lookupdirs;
        for (let j = 0;j<lookupdirs.length;j++) {
            let lookupdir = lookupdirs[j];
            var prom = searchFolder(sd, lookupdir)
            promises.push(prom)
        }
    }
    Promise.all(promises).then(function () {
        res.ALL.records = Object.keys(res.ALL.records)
        res.ALL.windows = Object.keys(res.ALL.windows)
        res.ALL.reports = Object.keys(res.ALL.reports)
        res.ALL.documents = Object.keys(res.ALL.documents)
        res.ALL.routines = Object.keys(res.ALL.routines)
        res.ALL.tools = Object.keys(res.ALL.tools)
        promise.resolve(res)
    })
    return promise.promise;
}

if (typeof window == 'undefined') {
    Explorer.search = Explorer.search__server;
    module.exports = Explorer
} else {
    Explorer.search = Explorer.search__client
    $.extend(true, window.oo, {explorer: Explorer})
}
