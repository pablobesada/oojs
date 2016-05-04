"use strict";

var path = require("path");
var fs = require("fs")

var classmanager = Object.create(null);

classmanager.scriptdirs = ["core", "base", "standard"];
classmanager.reversed_scriptdirs = classmanager.scriptdirs.reverse()

classmanager.lookupdirs = ["records", "windows"];

classmanager.getClassFilename = function getClassFilename(name, max_script_dir_index) {
    var ms = max_script_dir_index;
    if (ms == null) ms = 0;
    for (var i=ms; i<classmanager.reversed_scriptdirs.length; i++) {
        var sd = classmanager.reversed_scriptdirs[i];
        for (var j in classmanager.lookupdirs) {
            var ld = classmanager.lookupdirs[j];
            var fn = "./" + sd + "/" + ld + "/" + name + ".js";
            if (fs.existsSync(fn)) return fn;
        }
    }
    return null;
}

classmanager.createClass = function createClass(description, filename) {
    var ParentClass = classmanager.getParentClassFor(description.name, description.inherits, filename);
    //console.log(ParentClass)
    var ChildClass = ParentClass.createChildClass(description, filename);
    return ChildClass;
}

classmanager.getClass = function getClass(name, max_script_dir_index) {
    //console.log("en getClass: " + name)
    var ms = max_script_dir_index;
    if (ms == null) ms = 0;
    for (var i=ms; i<classmanager.reversed_scriptdirs.length; i++) {
        var sd = classmanager.reversed_scriptdirs[i];
        for (var j in classmanager.lookupdirs) {
            var ld = classmanager.lookupdirs[j];
            var modname = "./" + sd + "/" + ld + "/" + name;
            try {
                var r = global.__main__.require(modname);
                //console.log(["require: ./" + sd + "/" + ld + "/" + name, r])
                return r;
            } catch (e) {
                //console.log("mod not found")
                //console.log(e.message)
                //console.log("Cannot find module '" + modname + "'")
                //console.log(e.message == "Cannot find module '" + modname + "'")
                if (e.code != 'MODULE_NOT_FOUND' || e.message != "Cannot find module '" + modname + "'") throw(e)
            }
        }
    }
    //console.log("returning null class")
    return null;
};

classmanager.extractScriptDir = function extractScriptDir(classpath) {
    for (var i in classmanager.reversed_scriptdirs) {
        var sd = classmanager.reversed_scriptdirs[i];
        var idx = classpath.lastIndexOf("/"+sd+"/")
        if (idx >= 0) {
            return sd;
        }
    }
    return null;
}

classmanager.getParentClassFor = function getSuperClassFor(name, parent, classpath) {
    var sd = classmanager.extractScriptDir(classpath)
    var cls = classmanager.getClass(name, classmanager.reversed_scriptdirs.indexOf(sd)+1)
    //console.log([name, parent, dirname, sd, composer.reversed_scriptdirs.indexOf(sd)+1, cls]);
    if (cls != null) return cls;
    var cls = classmanager.getClass(parent);
    //console.log([name,parent,sd, "returning: " + cls.new().__description__.name])
    return cls;
};

module.exports = classmanager;