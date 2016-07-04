"use strict";

(function ($) {
    let oopath = '/lib/client/openorange.js'
    let ooscriptpath = $('script[src$="' + oopath + '"]').attr('src')
    let __baseurl__ = ooscriptpath.substring(0, ooscriptpath.length - oopath.length);

    let classmanager = Object.create(null);
    let orm = {};
    let __currentUser__ = null;
    classmanager.lookupdirs = ["records", "windows", "reports", "modules", "tools", "documents"];
    classmanager.scriptdirs = ["core", "base", "standard", "test"];
    classmanager.reversed_scriptdirs = Array.prototype.slice.call(classmanager.scriptdirs).reverse()
    classmanager.extractScriptDir = function extractScriptDir(dirname) {
        for (var i in classmanager.reversed_scriptdirs) {
            var sd = classmanager.reversed_scriptdirs[i];
            var idx = dirname.lastIndexOf("/" + sd + "/")
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


    let require = function require(module) {
        if (module == "openorange") return window.oo; //devuelvo window.oo porque ese objeto va a haber si extendido por windowmanager, listiwndowmanger, etc, etc, etc.
        if (module == "underscore") return _;
        if (module == "moment") return moment;
        if (module == "chance") return Chance;
        if (module == "js-md5") return md5;
        return loadModule(module)
    }

    function global() {
    }

    global.__main__ = {require: require}
    require.main = {require: require}

    classmanager.classes = {}
    classmanager.__class_structure__ = null;
    classmanager.getClassStructure = function getClassStructure() {
        let self = this;
        if (this.__class_structure__ == null) {
            var url = __baseurl__ + '/classStructure';
            $.ajax({
                url: url,
                contentType: 'application/json; charset=utf-8',
                dataType: "json",
                data: {},
                async: false,
                success: function (result) {
                    self.__class_structure__ = result.response;
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    console.log(errorThrown)
                    throw errorThrown;
                },
                complete: function () {
                }
            });
        }
        return self.__class_structure__;
    }

    classmanager.getClasses = function getClasses() {
        return classmanager.classes;
    }
    classmanager.getClass = function getClass(name, options) {
        let opts = options || {min_sd: 0, max_sd: classmanager.reversed_scriptdirs.length-1};
        let min_sd = 'min_sd' in opts? opts.min_sd : 0;
        let max_sd = 'max_sd' in opts? opts.max_sd : classmanager.reversed_scriptdirs.length-1;
        if (min_sd >= classmanager.reversed_scriptdirs.length) return null;
        if (name in classmanager.classes) {
            for (let c=0;c<classmanager.classes[name].length;c++) {
                let clsinfo = classmanager.classes[name][c]
                if (clsinfo.sd_idx >= min_sd && clsinfo.sd_idx <= max_sd) {
                    return clsinfo.cls;
                }
            }
        }
        let classStructure = classmanager.getClassStructure();
        for (let i = min_sd; i <= max_sd; i++) {
            var sd = classmanager.reversed_scriptdirs[i];
            for (let j = 0; j < classmanager.lookupdirs.length; j++) {
                let ld = classmanager.lookupdirs[j]
                if (name in classStructure[i][ld]) {
                    //console.log(`fetching from server`)
                    let url = __baseurl__ + '/class';
                    let res = null;
                    $.ajax({
                        url: url,
                        dataType: "script",
                        data: {name: name, min_sd: i, max_sd: i},
                        async: false,
                        success: function (result) {
                            //console.log("A) loading class: " + name)
                            res = moduleFunction();
                            //let sd = classmanager.extractScriptDir(res.getDescription().filename);
                            //console.log("SD: ", sd)
                            if (!(name in classmanager.classes)) classmanager.classes[name] = []
                            classmanager.classes[name].push({sd_idx: i, cls: res});
                            classmanager.classes[name].sort(function (a,b) {return a.sd_idx - b.sd_idx});
                        },
                        error: function (jqXHR, textStatus, errorThrown) {
                            console.log(errorThrown)
                            throw errorThrown;
                        },
                        complete: function () {
                        }
                    });
                    return res;
                }
            }
        }
        //console.log("class not found in structure")
        return null;
    }

    classmanager.SuperClass = function SuperClass(description) {
        return classmanager.getParentClassFor(description.name, description.inherits, description.filename);
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

        /*



         let modname = null;
         var ms = max_script_dir_index;
         if (ms == null) ms = 0;
         for (let i = ms; i < this.reversed_scriptdirs.length; i++) {
         var sd = this.reversed_scriptdirs[i];
         for (let j = 0; j < this.lookupdirs.length; j++) {
         let ld = this.lookupdirs[j]
         if (name in this.__class_structure__[i][ld]) {
         return getClass(name, i)
         }
         if (modname) break
         }
         if (modname) break
         }

         var k = name + "|" + parent + "|" + dirname;
         if (k in classmanager.classes) {
         //console.log("getparentclass: returning " + name + " from cache");
         return classmanager.classes[k];
         }
         var url = __baseurl__ + '/parentclass';
         var res = null;
         $.ajax({
         url: url,
         dataType: "script",
         async: false,
         data: {name: name, parent: parent, dirname: dirname},
         success: function (result) {
         console.log("B) loading class: " + name + " " + parent)
         res = moduleFunction();
         //console.log("en parent success: " + name +"/" + parent + "   " + res.__filename__);
         classmanager.classes[k] = res;
         //console.log("getparentclass: fetching " + name + "/" + parent + "/" + dirname + " from server");
         //console.log(res)
         if (res.__description__.name != name) {
         //console.log("storing as: " + res.__description__.name + " and " + res.__description__.name + "|0");
         classmanager.classes[res.__description__.name + "|0"] = res;
         }
         var sd_idx = classmanager.reversed_scriptdirs.indexOf(classmanager.extractScriptDir(res.__description__.filename));
         if (sd_idx != 0) {
         classmanager.classes[res.__description__.name + "|" + sd_idx] = res;
         }

         },
         error: function (jqXHR, textStatus, errorThrown) {
         if (textStatus == 'parsererror') {
         //evaluo el codigo que para vuelva a saltar el error y aparezca en el debugger
         eval(jqXHR.responseText)
         }
         console.log(errorThrown)
         throw errorThrown;
         },
         complete: function () {
         //console.log("en getparentclass::complete");
         }
         });
         return res;
         */
    }

    let loadedModules = {}
    let loadModule = function loadModule(url) {
        if (url in loadedModules) {
            //console.log("getparentclass: returning " + name + " from cache");
            return loadedModules[url];
        }
        var res = null;
        $.ajax({
            url: __baseurl__ + '/module',
            dataType: "script",
            data: {url: url},
            async: false,
            success: function (result) {
                //console.log("en success: " + name);
                res = moduleFunction();
                loadedModules[url] = res;
            },
            error: function (jqXHR, textStatus, errorThrown) {
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

    let login = function (user, pass) {
        let password = pass || '';
        $.ajax({
            url: __baseurl__ + '/login',
            contentType: 'application/json; charset=utf-8',
            async: true,
            type: "POST",
            dataType: "json",
            data: JSON.stringify({username: user, md5pass: md5(password)}),
            success: function (result) {
                if (result.ok == true) {
                    __currentUser__ = user;
                } else {
                    console.log(result.error)
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log(errorThrown)
                throw errorThrown;
            },
            complete: function () {
            }
        });

    }

    let rollback = function rollback() {
        return new Promise(function (resolve, reject) {
            var url = __baseurl__ + '/oo/rollback';
            $.ajax({
                type: "POST",
                url: url,
                contentType: 'application/json; charset=utf-8',
                dataType: "json",
                async: true,
                //data: JSON.stringify(data),
                success: function (result) {
                    if (!result.ok) {
                        reject(result.error);
                        return;
                    }
                    var response = 'response' in result ? result.response : null;
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

    let beginTransaction = function beginTransaction() {
        return new Promise(function (resolve, reject) {
            var url = __baseurl__ + '/oo/begintransaction';
            $.ajax({
                type: "POST",
                url: url,
                contentType: 'application/json; charset=utf-8',
                dataType: "json",
                async: true,
                //data: JSON.stringify(data),
                success: function (result) {
                    if (!result.ok) {
                        reject(result.error);
                        return;
                    }
                    var response = 'response' in result ? result.response : null;
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

    let commit = function commit() {
        return new Promise(function (resolve, reject) {
            var url = __baseurl__ + '/oo/commit';
            $.ajax({
                type: "POST",
                url: url,
                contentType: 'application/json; charset=utf-8',
                dataType: "json",
                async: true,
                //data: JSON.stringify(data),
                success: function (result) {
                    if (!result.ok) {
                        reject(result.error);
                        return;
                    }
                    var response = 'response' in result ? result.response : null;
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

    let currentUser = function currentUser() {
        return __currentUser__
    }

    let fetchCurrentUser = async function fetchCurrentUser() {
        return new Promise(function (resolve, reject) {
            $.ajax({
                type: "GET",
                url: __baseurl__ + '/getcurrentuser',
                contentType: 'application/json; charset=utf-8',
                dataType: "json",
                async: true,
                success: function (result) {
                    if (!result.ok) {
                        reject(result.error);
                        return;
                    }
                    var response = 'response' in result ? result.response : null;
                    __currentUser__ = result.currentuser;
                    resolve(result.currentuser);
                    return;
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    reject(errorThrown);
                },
                complete: function () {
                    //console.log("en load::complete");
                }
            });
        });
    }

    let askYesNo = async function askYesNo(txt) {
        if (oo.ui && oo.ui.dialogs && oo.ui.dialogs.askYesNo) {
            return oo.ui.dialogs.askYesNo(txt);
        }
        throw new Error("Dialog not found");
    }

    let inputString = async function inputString(txt) {
        if (oo.ui && oo.ui.dialogs && oo.ui.dialogs.inputString) {
            return oo.ui.dialogs.inputString(txt);
        }
        throw new Error("Dialog not found");
    }

    let alert = async function alert(txt) {
        console.log("en alert")
        if (oo.ui && oo.ui.dialogs && oo.ui.dialogs.alert) {
            return oo.ui.dialogs.alert(txt);
        }
        throw new Error("Dialog not found");
    }

    let postMessage = async function postMessage(txt) {
        console.log("en alert")
        if (oo.ui && oo.ui.dialogs && oo.ui.dialogs.postMessage) {
            return oo.ui.dialogs.postMessage(txt);
        }
        throw new Error("Dialog not found");
    }

    class PushReceiver {
        constructor() {
            let self = this;
            self.socket = io()
            self.socket.on('askYesNo', async function (data, fn) {let r = await oo.askYesNo(data); if (fn) fn(r);});
            self.socket.on('inputString', async function (data, fn) {let r= await oo.inputString(data); if (fn) fn(r);});
            //self.socket.on('inputString', async function (data) {self.socket.emit('response',await oo.inputString(data))});
            self.socket.on('alert', async function (data, fn) {let r = await oo.alert(data); if (fn) fn(r);});
            self.socket.on('postMessage', async function (data, fn) {let r = await oo.postMessage(data); if (fn) fn(r);});
        }
    }

    let oo = {
        ui: {},
        classmanager: classmanager,
        orm: orm,
        isServer: false,
        isClient: true,
        login: login,
        beginTransaction: beginTransaction,
        rollback: rollback,
        commit: commit,
        currentUser: currentUser,
        baseurl: __baseurl__,
        md5: md5,
        alert: alert,
        askYesNo: askYesNo,
        inputString: inputString,
        postMessage: postMessage,
        pushreceiver: new PushReceiver(),
        //ready: ready,
    }

    fetchCurrentUser();






    window.oo = oo
    window.require = require
    //$.extend(true, window, {require: require, oo: oo})
})(jQuery)