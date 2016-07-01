"use strict";

(function ($) {
    let oopath = '/lib/client/openorange.js'
    let ooscriptpath = $('script[src$="'+oopath+'"]').attr('src')
    let __baseurl__ = ooscriptpath.substring(0, ooscriptpath.length-oopath.length);

    let classmanager = {};
    let orm = {};
    let __currentUser__ = null;
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
    classmanager.getClass = function getClass(name, max_script_dir_index) {
        if (max_script_dir_index == null) max_script_dir_index = 0;
        var k = name + "|" + max_script_dir_index;
        if (k in classmanager.classes) {
            //console.log("getclass: returning " + name + " from cache");
            return classmanager.classes[k]
        }
        //console.log("getclass: fetching " + name + " from server");
        var url = __baseurl__ + '/class';
        var res = null;
        $.ajax({
            url: url,
            dataType: "script",
            data: {name: name, max_script_dir_index: max_script_dir_index},
            async: false,
            success: function (result) {
                //console.log("en success: " + name);
                res = moduleFunction();
                classmanager.classes[k] = res;
                //if (!max_script_dir_index) classmanager.classes[name] = res;
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

    classmanager.SuperClass = function SuperClass(description) {
        return classmanager.getParentClassFor(description.name, description.inherits, description.filename);
    }

    classmanager.getParentClassFor = function getParentClassFor(name, parent, dirname) {
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

    $(document).ready(function () {
    })

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
        md5: md5
        //ready: ready,
    }

    fetchCurrentUser();
    //window.require = require

    $.extend(true, window, {require: require, oo: oo})
})(jQuery)