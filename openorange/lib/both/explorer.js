"use strict";

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

var cm = null;
function getClassManager() {
    if (cm == null) cm = require("openorange").classmanager;
    return cm;
}

var Explorer = Object.create(null);

Explorer.search__server = function () {
    var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(txt) {
        var self, res, regexp, modules, modname, module, j, entry, _j;

        return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        self = this;
                        res = [];
                        regexp = new RegExp(txt, "i");
                        _context.next = 5;
                        return self.findAllModules();

                    case 5:
                        modules = _context.sent;

                        for (modname in modules) {
                            module = modules[modname];

                            for (j = 0; j < module.records.length; j++) {
                                entry = module.records[j];

                                if (entry.label.search(regexp) >= 0) res.push({ type: 'Record Class', name: entry.name, label: entry.label, access: entry.access });
                            }
                            for (_j = 0; _j < module.reports.length; _j++) {
                                entry = module.reports[_j];

                                if (entry.label.search(regexp) >= 0) res.push({ type: 'Report', name: entry.name, label: entry.label, access: entry.access });
                            }
                        }
                        return _context.abrupt("return", res);

                    case 8:
                    case "end":
                        return _context.stop();
                }
            }
        }, _callee, this);
    }));

    function search(_x) {
        return ref.apply(this, arguments);
    }

    return search;
}();

Explorer.search__client = function search(txt) {
    var self = this;
    return new Promise(function (resolve, reject) {
        var url = '/runtime/explorer/search';
        $.ajax({
            type: "GET",
            url: url,
            contentType: 'application/json; charset=utf-8',
            async: true,
            data: { txt: txt },
            success: function success(result) {
                if (!result.ok) {
                    reject(result.error);
                    return;
                }
                resolve(result.response);
                return;
            },
            error: function error(jqXHR, textStatus, errorThrown) {
                //console.log("en fail")
                reject(errorThrown);
            },
            complete: function complete() {
                //console.log("en load::complete");
            }
        });
    });
};

Explorer.findAllModules = function findAllModules() {
    var Promise = require("bluebird");
    var fs = require("fs");
    var path = require("path");
    var res = { ALL: { records: {}, windows: {}, documents: {}, reports: {}, routines: {}, tools: {} } };
    function searchFolder(sd, lookupdir) {
        var folder = "./" + sd + "/" + lookupdir;
        var promise = Promise.pending();
        fs.readdir(folder, function (err, files) {
            if (err) {
                promise.resolve();
                return;
            };
            if (lookupdir == 'modules') {
                for (var i = 0; i < files.length; i++) {
                    var filename = files[i];
                    if (!filename.endsWith(".js")) continue;
                    var cname = path.parse(filename).name;
                    if (!(cname in res)) res[cname] = cm.getClass(cname).getDescription();
                }
            } else {
                for (var _i = 0; _i < files.length; _i++) {
                    var _filename = files[_i];
                    if (!_filename.endsWith(".js")) continue;
                    var cname = path.parse(_filename).name;
                    if (!(cname in res.ALL[lookupdir])) res.ALL[lookupdir][cname] = cname;
                }
            }
            promise.resolve();
        });
        return promise.promise;
    }

    var promise = Promise.pending();

    var promises = [];
    for (var i = 0; i < getClassManager().reversed_scriptdirs.length; i++) {
        var sd = getClassManager().reversed_scriptdirs[i];
        var lookupdirs = getClassManager().lookupdirs;
        for (var j = 0; j < lookupdirs.length; j++) {
            var lookupdir = lookupdirs[j];
            var prom = searchFolder(sd, lookupdir);
            promises.push(prom);
        }
    }
    Promise.all(promises).then(function () {
        res.ALL.records = Object.keys(res.ALL.records);
        res.ALL.windows = Object.keys(res.ALL.windows);
        res.ALL.reports = Object.keys(res.ALL.reports);
        res.ALL.documents = Object.keys(res.ALL.documents);
        res.ALL.routines = Object.keys(res.ALL.routines);
        res.ALL.tools = Object.keys(res.ALL.tools);
        promise.resolve(res);
    });
    return promise.promise;
};

if (typeof window == 'undefined') {
    Explorer.search = Explorer.search__server;
    module.exports = Explorer;
} else {
    Explorer.search = Explorer.search__client;
    $.extend(true, window.oo, { explorer: Explorer });
}

//# sourceMappingURL=explorer.js.map