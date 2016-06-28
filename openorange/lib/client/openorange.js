"use strict";

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

(function ($) {
    var classmanager = {};
    var orm = {};
    var __currentUser__ = null;
    classmanager.scriptdirs = ["core", "base", "standard", "test"];
    classmanager.reversed_scriptdirs = Array.prototype.slice.call(classmanager.scriptdirs).reverse();
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

    var require = function require(module) {
        if (module == "openorange") return window.oo; //devuelvo window.oo porque ese objeto va a haber si extendido por windowmanager, listiwndowmanger, etc, etc, etc.
        if (module == "underscore") return _;
        if (module == "moment") return moment;
        if (module == "chance") return Chance;
        return loadModule(module);
    };

    function global() {}

    global.__main__ = { require: require };
    require.main = { require: require };

    classmanager.classes = {};
    classmanager.getClass = function getClass(name, max_script_dir_index) {
        if (max_script_dir_index == null) max_script_dir_index = 0;
        var k = name + "|" + max_script_dir_index;
        if (k in classmanager.classes) {
            //console.log("getclass: returning " + name + " from cache");
            return classmanager.classes[k];
        }
        //console.log("getclass: fetching " + name + " from server");
        var url = '/runtime/class';
        var res = null;
        $.ajax({
            url: url,
            dataType: "script",
            data: { name: name, max_script_dir_index: max_script_dir_index },
            async: false,
            success: function success(result) {
                //console.log("en success: " + name);
                res = moduleFunction();
                classmanager.classes[k] = res;
                //if (!max_script_dir_index) classmanager.classes[name] = res;
            },
            error: function error(jqXHR, textStatus, errorThrown) {
                //console.log("en fail")
                console.log(errorThrown);
                throw errorThrown;
            },
            complete: function complete() {
                //console.log("en getclass::complete");
            }
        });
        return res;
    };

    classmanager.SuperClass = function SuperClass(description) {
        return classmanager.getParentClassFor(description.name, description.inherits, description.filename);
    };

    classmanager.getParentClassFor = function getParentClassFor(name, parent, dirname) {
        var k = name + "|" + parent + "|" + dirname;
        if (k in classmanager.classes) {
            //console.log("getparentclass: returning " + name + " from cache");
            return classmanager.classes[k];
        }
        var url = '/runtime/parentclass';
        var res = null;
        $.ajax({
            url: url,
            dataType: "script",
            async: false,
            data: { name: name, parent: parent, dirname: dirname },
            success: function success(result) {
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
            error: function error(jqXHR, textStatus, errorThrown) {
                if (textStatus == 'parsererror') {
                    //evaluo el codigo que para vuelva a saltar el error y aparezca en el debugger
                    eval(jqXHR.responseText);
                }
                console.log(errorThrown);
                throw errorThrown;
            },
            complete: function complete() {
                //console.log("en getparentclass::complete");
            }
        });
        return res;
    };

    var loadedModules = {};
    var loadModule = function loadModule(url) {
        if (url in loadedModules) {
            //console.log("getparentclass: returning " + name + " from cache");
            return loadedModules[url];
        }
        var res = null;
        $.ajax({
            url: 'runtime/module',
            dataType: "script",
            data: { url: url },
            async: false,
            success: function success(result) {
                //console.log("en success: " + name);
                res = moduleFunction();
                loadedModules[url] = res;
            },
            error: function error(jqXHR, textStatus, errorThrown) {
                //console.log("en fail")
                console.log(errorThrown);
                throw errorThrown;
            },
            complete: function complete() {
                //console.log("en getclass::complete");
            }
        });
        return res;
    };

    $(document).ready(function () {
        var oo = require("openorange");
        $('#OOSearch.typeahead').typeahead({ hint: true }, {
            async: true,
            display: 'label',
            limit: 4,
            source: function source(query, syncResults, asyncResults) {

                //syncResults([])
                oo.explorer.search(query).then(function (results) {
                    //console.log(results.length)
                    asyncResults(results);
                });
            }
        }).on('typeahead:selected', function (obj, datum) {
            var wnd = null;
            switch (datum.type) {
                case 'Record Class':
                    wnd = oo.classmanager.getClass(datum.access).new();
                    break;
                case 'Report':
                    wnd = oo.classmanager.getClass(datum.name).new();
                    break;
            }
            if (wnd != null) {
                wnd.open();
                wnd.setFocus();
            }
        });
        $('span.twitter-typeahead').attr('style', '').removeClass("twitter-typeahead");
    });

    var login = function login(user, password) {
        $.ajax({
            url: '/runtime/login',
            contentType: 'application/json; charset=utf-8',
            async: true,
            type: "POST",
            dataType: "json",
            data: JSON.stringify({ user: user, password: password }),
            success: function success(result) {
                if (result.ok == true) __currentUser__ = user;
            },
            error: function error(jqXHR, textStatus, errorThrown) {
                console.log(errorThrown);
                throw errorThrown;
            },
            complete: function complete() {}
        });
    };

    var rollback = function rollback() {
        return new Promise(function (resolve, reject) {
            var url = '/runtime/oo/rollback';
            $.ajax({
                type: "POST",
                url: url,
                contentType: 'application/json; charset=utf-8',
                dataType: "json",
                async: true,
                //data: JSON.stringify(data),
                success: function success(result) {
                    if (!result.ok) {
                        reject(result.error);
                        return;
                    }
                    var response = 'response' in result ? result.response : null;
                    resolve(response);
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

    var commit = function commit() {
        return new Promise(function (resolve, reject) {
            var url = '/runtime/oo/commit';
            $.ajax({
                type: "POST",
                url: url,
                contentType: 'application/json; charset=utf-8',
                dataType: "json",
                async: true,
                //data: JSON.stringify(data),
                success: function success(result) {
                    if (!result.ok) {
                        reject(result.error);
                        return;
                    }
                    var response = 'response' in result ? result.response : null;
                    resolve(response);
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

    var currentUser = function currentUser() {
        return __currentUser__;
    };

    var fetchCurrentUser = function () {
        var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
            return regeneratorRuntime.wrap(function _callee$(_context) {
                while (1) {
                    switch (_context.prev = _context.next) {
                        case 0:
                            $.ajax({
                                type: "GET",
                                url: '/runtime/getcurrentuser',
                                contentType: 'application/json; charset=utf-8',
                                dataType: "json",
                                async: true,
                                success: function success(result) {
                                    if (!result.ok) {
                                        reject(result.error);
                                        return;
                                    }
                                    var response = 'response' in result ? result.response : null;
                                    __currentUser__ = result.currentuser;
                                    resolve(result.currentuser);
                                    return;
                                },
                                error: function error(jqXHR, textStatus, errorThrown) {
                                    reject(errorThrown);
                                },
                                complete: function complete() {
                                    //console.log("en load::complete");
                                }
                            });

                        case 1:
                        case "end":
                            return _context.stop();
                    }
                }
            }, _callee, this);
        }));

        function fetchCurrentUser() {
            return ref.apply(this, arguments);
        }

        return fetchCurrentUser;
    }();

    var oo = {
        classmanager: classmanager,
        orm: orm,
        isServer: false,
        isClient: true,
        login: login,
        rollback: rollback,
        commit: commit,
        currentUser: currentUser
    };

    fetchCurrentUser();
    //window.require = require
    $.extend(true, window, { require: require, oo: oo });
})(jQuery);

//# sourceMappingURL=openorange.js.map