"use strict";

var classmanager = {};
var orm = {};
classmanager.scriptdirs = ["core", "base", "standard"];
classmanager.reversed_scriptdirs = classmanager.scriptdirs.reverse()
classmanager.extractScriptDir = function extractScriptDir(dirname) {
    for (var i in classmanager.reversed_scriptdirs) {
        var sd = classmanager.reversed_scriptdirs[i];
        var idx = dirname.lastIndexOf("/"+sd+"/")
        if (idx >= 0) {
            return sd;
        }
    }
    return null;
}

classmanager.createClass = function createClass(description, filename) {
    var ParentClass = classmanager.getParentClassFor(description.name, description.inherits, filename);
    var ChildClass = ParentClass.createChildClass(description, filename);
    return ChildClass;
}
function require(module) {
    if (module == "./openorange") return {
        classmanager: classmanager,
        orm: orm,
        query: ClientQuery,
        isServer: false,
        isClient: true,
    }
    if (module == "underscore") return _;
    if (module == "momentjs") return moment;
    //if (module == "./openorange/windowmanager") return WindowContainer;
    return loadModule(module)
}

function global(){}
global.__main__ = {require: require}
require.main = {require: require}

var classes = {}
classmanager.getClass = function getClass(name, max_script_dir_index) {
    var k = name + "|" + max_script_dir_index;
    if (k in classes) {
        //console.log("getclass: returning " + name + " from cache");
        return classes[k]
    }
    var url = '/runtime/class';
    var res = null;
    $.ajax({
        url: url,
        dataType: "script",
        data: {name: name, max_script_dir_index: max_script_dir_index},
        async: false,
        success: function (result) {
            //console.log("en success: " + name);
            res = moduleFunction();
            classes[k] = res;
            if (!max_script_dir_index) classes[name] = res;
        },
        error: function (jqXHR, textStatus, errorThrown ) {
            //console.log("en fail")
            console.log(errorThrown)
            throw errorThrown;
        },
        complete: function () {
            //console.log("en getclass::complete");
        }
    });
    return res;
}

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
        data: {name: name, parent: parent, dirname: dirname},
        success: function (result) {
            res = moduleFunction();
            //console.log("en parent success: " + name +"/" + parent + "   " + res.__filename__);
            classes[k] = res;
        },
        error: function (jqXHR, textStatus, errorThrown ) {
            //console.log("en fail")
            throw errorThrown;
        },
        complete: function () {
            //console.log("en getparentclass::complete");
        }
    });
    return res;
}

var loadedModules = {}
var loadModule = function loadModule(url) {
    if (url in loadedModules) {
        //console.log("getparentclass: returning " + name + " from cache");
        return loadedModules[url];
    }
    var res = null;
    $.ajax({
        url: 'runtime/module',
        dataType: "script",
        data: {url: url},
        async: false,
        success: function (result) {
            //console.log("en success: " + name);
            res = moduleFunction();
            loadedModules[url] = res;
        },
        error: function (jqXHR, textStatus, errorThrown ) {
            //console.log("en fail")
            console.log(errorThrown)
            throw errorThrown;
        },
        complete: function () {
            //console.log("en getclass::complete");
        }
    });
    return res;
}