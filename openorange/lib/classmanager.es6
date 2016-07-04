"use strict";

var path = require("path");
var fs = require("fs")

var classmanager = Object.create(null);

classmanager.createClassStructure = function loadClassStructure() {
    let classStructure = []

    function readFolderSync(sd, lookupdir, sdstruct) {
        var folder = path.join("./", sd, lookupdir);
        try {
            let files = fs.readdirSync(folder)
            for (let i = 0; i < files.length; i++) {
                let filename = files[i];
                if (filename.endsWith(".js")) sdstruct[lookupdir][path.basename(filename, ".js")] = 1;
            }
        } catch (err) {
            if (err.code !== 'ENOENT') throw err;
        }
    }

    for (let i = 0; i < this.reversed_scriptdirs.length; i++) {
        var sd = this.reversed_scriptdirs[i];
        let sdstruct = {sd: sd}
        let lookupdirs = this.lookupdirs;
        for (let j = 0; j < lookupdirs.length; j++) {
            let lookupdir = lookupdirs[j];
            sdstruct[lookupdir] = {}
            readFolderSync(sd, lookupdir, sdstruct)
        }
        classStructure.push(sdstruct);
    }
    return classStructure;
}

classmanager.init = function init() {
    this.__class_structure__ = this.createClassStructure();
    return this;
}

classmanager.scriptdirs = []
classmanager.reversed_scriptdirs = []
classmanager.addScriptDir = function addScriptDir(sd) {
    classmanager.scriptdirs.push(sd)
    classmanager.reversed_scriptdirs = Array.prototype.slice.call(classmanager.scriptdirs).reverse()
}

classmanager.addScriptDir("core");
classmanager.addScriptDir("base");
classmanager.addScriptDir("standard");
classmanager.addScriptDir("test")
classmanager.lookupdirs = ["records", "windows", "reports", "modules", "tools", "documents"];

classmanager.getClassFilename = function getClassFilename(name, min_script_dir_index) {
    var ms = min_script_dir_index;
    if (ms == null) ms = 0;
    for (var i = ms; i < classmanager.reversed_scriptdirs.length; i++) {
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
    var ChildClass = ParentClass.createChildClass(description, filename);
    return ChildClass;
}

classmanager.getClassStructure = function getClassStructur() {
    return this.__class_structure__;
}

classmanager.getClass = function getClass(name, options) {
    let opts = options || {min_sd: 0, max_sd: classmanager.reversed_scriptdirs.length-1};
    var min_sd = 'min_sd' in opts? opts.min_sd : 0;
    var max_sd = 'max_sd' in opts? opts.max_sd : classmanager.reversed_scriptdirs.length-1;
    if (min_sd >= classmanager.reversed_scriptdirs.length) return null;
    for (let i = min_sd; i <= max_sd; i++) {
        var sd = this.reversed_scriptdirs[i];
        for (let j = 0; j < this.lookupdirs.length; j++) {
            let ld = this.lookupdirs[j]
            if (name in this.__class_structure__[i][ld]) {
                let modname = "./" + sd + "/" + ld + "/" + name;
                let r = global.__main__.require(modname);
                return r;
            }
        }
    }
    return null;
}


/*
 classmanager.getClass = function getClass(name, max_script_dir_index) {
 //console.log("en getClass: " + name)
 var ms = max_script_dir_index;
 if (ms == null) ms = 0;
 for (var i = ms; i < classmanager.reversed_scriptdirs.length; i++) {
 var sd = classmanager.reversed_scriptdirs[i];
 for (var j in classmanager.lookupdirs) {
 var ld = classmanager.lookupdirs[j];
 var modname = "./" + sd + "/" + ld + "/" + name;
 try {
 //console.log("requiring: " + modname)
 var r = global.__main__.require(modname);
 //console.log(`found ${name} in ${modname}`)
 return r;
 } catch (e) {
 //console.log("ESTOY ACA", e.code, e.message, (e.code != 'MODULE_NOT_FOUND' || e.message != "Cannot find module '" + modname + "'"))
 if (e.code != 'MODULE_NOT_FOUND' || e.message != "Cannot find module '" + modname + "'") {
 console.log("Error requiring module: " + modname);
 console.log(e.stack);
 console.log(e.message);
 throw(e)
 }
 }
 }
 }
 //console.log("returning null class")
 return null;
 };
 */

classmanager.extractScriptDir = function extractScriptDir(classpath) {
    for (var i in classmanager.reversed_scriptdirs) {
        var sd = classmanager.reversed_scriptdirs[i];
        var idx = classpath.lastIndexOf("/" + sd + "/")
        if (idx >= 0) {
            return sd;
        }
    }
    return null;
}

classmanager.getParentClassFor = function getParentClassFor(name, parent, classpath) {
    if (!name || !parent || !classpath) {
        if (!name) throw new Error("can't find a parent class without a name")
        if (!parent) throw new Error("can't find a parent class without a inherit attrbute")
        if (!classpath) throw new Error("can't find a parent class without a path")
    }
    var sd = classmanager.extractScriptDir(classpath)

    var cls = classmanager.getClass(name, {min_sd: classmanager.reversed_scriptdirs.indexOf(sd) + 1})
    if (cls != null) return cls;
    var cls = classmanager.getClass(parent);
    return cls;
};

classmanager.SuperClass = function SuperClass(description) {
    let superclass = classmanager.getParentClassFor(description.name, description.inherits, description.filename)
    //superclass = superclass.prepareParentClass(description, classpath)
    return superclass
};

module.exports = classmanager;