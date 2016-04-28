"use strict";

var classmanager = {};
var orm = {};
classmanager.scriptdirs = ["core", "base"];
classmanager.reversed_scriptdirs = classmanager.scriptdirs.reverse();
classmanager.extractScriptDir = function extractScriptDir(dirname) {
    for (var i in classmanager.reversed_scriptdirs) {
        var sd = classmanager.reversed_scriptdirs[i];
        var idx = dirname.lastIndexOf("/" + sd + "/");
        if (idx >= 0) {
            return sd;
        }
    }
    return null;
};

classmanager.createClass = function createClass(description, filename) {
    var ParentClass = classmanager.getParentClassFor(description.name, description.inherits, filename);
    var ChildClass = ParentClass.createChildClass(description, filename);
    return ChildClass;
};
function require(module) {
    if (module == "./openorange") return {
        classmanager: classmanager,
        orm: orm
    };
    if (module == "underscore") return _;
}

function global() {}
global.__main__ = { require: require };
require.main = { require: require };

orm.load = function load(rec) {
    //var jsonrecord = JSON.stringify(record);
    return new Promise(function (resolve, reject) {
        var url = '/runtime/load';
        $.ajax({
            type: "POST",
            url: url,
            contentType: 'application/json; charset=utf-8',
            dataType: "json",
            async: true,
            data: JSON.stringify(rec.toJSON()),
            success: function (result) {
                console.log("loaded");
                if (!result.ok) {
                    callback(result.error);
                    return;
                }
                console.log(result);
                classmanager.getClass("Embedded_Record").fromJSON(result.rec, rec);
                resolve();
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
};

orm.store = function store(rec, callback) {
    //var jsonrecord = JSON.stringify(record);
    var url = '/runtime/store';
    $.ajax({
        type: "POST",
        url: url,
        contentType: 'application/json; charset=utf-8',
        dataType: "json",
        async: true,
        data: JSON.stringify(rec.toJSON()),
        success: function (result) {
            console.log("loaded");
            if (!result.ok) {
                if (callback) callback(result.error);
                return;
            }
            console.log(result);
            classmanager.getClass("Embedded_Record").fromJSON(result.rec, rec);
            callback();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            //console.log("en fail")
            throw errorThrown;
        },
        complete: function () {
            //console.log("en load::complete");
        }
    });
};

var classes = {};
classmanager.getClass = function getClass(name, max_script_dir_index) {
    var k = name + "|" + max_script_dir_index;
    if (k in classes) {
        //console.log("getclass: returning " + name + " from cache");
        return classes[k];
    }
    var url = '/runtime/class';
    var res = null;
    $.ajax({
        url: url,
        dataType: "script",
        data: { name: name, max_script_dir_index: max_script_dir_index },
        async: false,
        success: function (result) {
            //console.log("en success: " + name);
            res = moduleFunction();
            classes[k] = res;
            if (!max_script_dir_index) classes[name] = res;
        },
        error: function (jqXHR, textStatus, errorThrown) {
            //console.log("en fail")
            console.log(errorThrown);
            throw errorThrown;
        },
        complete: function () {
            //console.log("en getclass::complete");
        }
    });
    return res;
};

classmanager.getParentClassFor = function getParentClassFor(name, parent, dirname) {
    var k = name + "|" + parent + "|" + dirname;
    if (k in classes) {
        //console.log("getparentclass: returning " + name + " from cache");
        return classes[k];
    }
    var url = '/runtime/parentclass';
    var res = null;
    $.ajax({
        url: url,
        dataType: "script",
        async: false,
        data: { name: name, parent: parent, dirname: dirname },
        success: function (result) {
            res = moduleFunction();
            //console.log("en parent success: " + name +"/" + parent + "   " + res.__filename__);
            classes[k] = res;
        },
        error: function (jqXHR, textStatus, errorThrown) {
            //console.log("en fail")
            throw errorThrown;
        },
        complete: function () {
            //console.log("en getparentclass::complete");
        }
    });
    return res;
};

var cm = require("./openorange").classmanager;
var SalesOrder = cm.getClass("SalesOrder");
var so = SalesOrder.new();
so.SerNr = 333;

//so.SerNr = 999
so.load().then(function () {
    console.log("loaded");
    console.log(so.CustCode);
    console.log(so.Items.length);
}).then(function () {
    so.CustCode = so.CustCode + "X";
    var sorw = so.Items.newRow();
    sorw.ArtCode = "I" + so.Items.length;
    so.Items.push(sorw);
    so.Items[1].Name = 'PABLO';
    return so.save();
}).then(function () {
    console.log("saved: " + so.CustCode);
    console.log("items: " + so.Items.length);
}).catch(function (error) {
    console.log(JSON.stringify(error));
}).then(function () {});

//# sourceMappingURL=test-compiled.js.map