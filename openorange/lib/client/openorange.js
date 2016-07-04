"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

(function ($) {
    var oopath = '/lib/client/openorange.js';
    var ooscriptpath = $('script[src$="' + oopath + '"]').attr('src');
    var __baseurl__ = ooscriptpath.substring(0, ooscriptpath.length - oopath.length);

    var classmanager = Object.create(null);
    var orm = {};
    var __currentUser__ = null;
    classmanager.lookupdirs = ["records", "windows", "reports", "modules", "tools", "documents"];
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
        if (module == "js-md5") return md5;
        return loadModule(module);
    };

    function global() {}

    global.__main__ = { require: require };
    require.main = { require: require };

    classmanager.classes = {};
    classmanager.__class_structure__ = null;
    classmanager.getClassStructure = function getClassStructure() {
        var self = this;
        if (this.__class_structure__ == null) {
            var url = __baseurl__ + '/classStructure';
            $.ajax({
                url: url,
                contentType: 'application/json; charset=utf-8',
                dataType: "json",
                data: {},
                async: false,
                success: function success(result) {
                    self.__class_structure__ = result.response;
                },
                error: function error(jqXHR, textStatus, errorThrown) {
                    console.log(errorThrown);
                    throw errorThrown;
                },
                complete: function complete() {}
            });
        }
        return self.__class_structure__;
    };

    classmanager.getClasses = function getClasses() {
        return classmanager.classes;
    };
    classmanager.getClass = function getClass(name, options) {
        var opts = options || { min_sd: 0, max_sd: classmanager.reversed_scriptdirs.length - 1 };
        var min_sd = 'min_sd' in opts ? opts.min_sd : 0;
        var max_sd = 'max_sd' in opts ? opts.max_sd : classmanager.reversed_scriptdirs.length - 1;
        if (min_sd >= classmanager.reversed_scriptdirs.length) return null;
        if (name in classmanager.classes) {
            for (var c = 0; c < classmanager.classes[name].length; c++) {
                var clsinfo = classmanager.classes[name][c];
                if (clsinfo.sd_idx >= min_sd && clsinfo.sd_idx <= max_sd) {
                    return clsinfo.cls;
                }
            }
        }
        var classStructure = classmanager.getClassStructure();

        var _loop = function _loop(i) {
            sd = classmanager.reversed_scriptdirs[i];

            for (var j = 0; j < classmanager.lookupdirs.length; j++) {
                var ld = classmanager.lookupdirs[j];
                if (name in classStructure[i][ld]) {
                    var _ret2 = function () {
                        //console.log(`fetching from server`)
                        var url = __baseurl__ + '/class';
                        var res = null;
                        $.ajax({
                            url: url,
                            dataType: "script",
                            data: { name: name, min_sd: i, max_sd: i },
                            async: false,
                            success: function success(result) {
                                //console.log("A) loading class: " + name)
                                res = moduleFunction();
                                //let sd = classmanager.extractScriptDir(res.getDescription().filename);
                                //console.log("SD: ", sd)
                                if (!(name in classmanager.classes)) classmanager.classes[name] = [];
                                classmanager.classes[name].push({ sd_idx: i, cls: res });
                                classmanager.classes[name].sort(function (a, b) {
                                    return a.sd_idx - b.sd_idx;
                                });
                            },
                            error: function error(jqXHR, textStatus, errorThrown) {
                                console.log(errorThrown);
                                throw errorThrown;
                            },
                            complete: function complete() {}
                        });
                        return {
                            v: {
                                v: res
                            }
                        };
                    }();

                    if ((typeof _ret2 === 'undefined' ? 'undefined' : _typeof(_ret2)) === "object") return _ret2.v;
                }
            }
        };

        for (var i = min_sd; i <= max_sd; i++) {
            var sd;

            var _ret = _loop(i);

            if ((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object") return _ret.v;
        }
        //console.log("class not found in structure")
        return null;
    };

    classmanager.SuperClass = function SuperClass(description) {
        return classmanager.getParentClassFor(description.name, description.inherits, description.filename);
    };

    classmanager.getParentClassFor = function getParentClassFor(name, parent, classpath) {
        if (!name || !parent || !classpath) {
            if (!name) throw new Error("can't find a parent class without a name");
            if (!parent) throw new Error("can't find a parent class without a inherit attrbute");
            if (!classpath) throw new Error("can't find a parent class without a path");
        }
        var sd = classmanager.extractScriptDir(classpath);
        var cls = classmanager.getClass(name, { min_sd: classmanager.reversed_scriptdirs.indexOf(sd) + 1 });
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
    };

    var loadedModules = {};
    var loadModule = function loadModule(url) {
        if (url in loadedModules) {
            //console.log("getparentclass: returning " + name + " from cache");
            return loadedModules[url];
        }
        var res = null;
        $.ajax({
            url: __baseurl__ + '/module',
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

    var login = function login(user, pass) {
        var password = pass || '';
        $.ajax({
            url: __baseurl__ + '/login',
            contentType: 'application/json; charset=utf-8',
            async: true,
            type: "POST",
            dataType: "json",
            data: JSON.stringify({ username: user, md5pass: md5(password) }),
            success: function success(result) {
                if (result.ok == true) {
                    __currentUser__ = user;
                } else {
                    console.log(result.error);
                }
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
            var url = __baseurl__ + '/oo/rollback';
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

    var beginTransaction = function beginTransaction() {
        return new Promise(function (resolve, reject) {
            var url = __baseurl__ + '/oo/begintransaction';
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
            var url = __baseurl__ + '/oo/commit';
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
                            return _context.abrupt('return', new Promise(function (resolve, reject) {
                                $.ajax({
                                    type: "GET",
                                    url: __baseurl__ + '/getcurrentuser',
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
                            }));

                        case 1:
                        case 'end':
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

    var askYesNo = function () {
        var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(txt) {
            return regeneratorRuntime.wrap(function _callee2$(_context2) {
                while (1) {
                    switch (_context2.prev = _context2.next) {
                        case 0:
                            if (!(oo.ui && oo.ui.dialogs && oo.ui.dialogs.askYesNo)) {
                                _context2.next = 2;
                                break;
                            }

                            return _context2.abrupt('return', oo.ui.dialogs.askYesNo(txt));

                        case 2:
                            throw new Error("Dialog not found");

                        case 3:
                        case 'end':
                            return _context2.stop();
                    }
                }
            }, _callee2, this);
        }));

        function askYesNo(_x) {
            return ref.apply(this, arguments);
        }

        return askYesNo;
    }();

    var inputString = function () {
        var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee3(txt) {
            return regeneratorRuntime.wrap(function _callee3$(_context3) {
                while (1) {
                    switch (_context3.prev = _context3.next) {
                        case 0:
                            if (!(oo.ui && oo.ui.dialogs && oo.ui.dialogs.inputString)) {
                                _context3.next = 2;
                                break;
                            }

                            return _context3.abrupt('return', oo.ui.dialogs.inputString(txt));

                        case 2:
                            throw new Error("Dialog not found");

                        case 3:
                        case 'end':
                            return _context3.stop();
                    }
                }
            }, _callee3, this);
        }));

        function inputString(_x2) {
            return ref.apply(this, arguments);
        }

        return inputString;
    }();

    var alert = function () {
        var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee4(txt) {
            return regeneratorRuntime.wrap(function _callee4$(_context4) {
                while (1) {
                    switch (_context4.prev = _context4.next) {
                        case 0:
                            console.log("en alert");

                            if (!(oo.ui && oo.ui.dialogs && oo.ui.dialogs.alert)) {
                                _context4.next = 3;
                                break;
                            }

                            return _context4.abrupt('return', oo.ui.dialogs.alert(txt));

                        case 3:
                            throw new Error("Dialog not found");

                        case 4:
                        case 'end':
                            return _context4.stop();
                    }
                }
            }, _callee4, this);
        }));

        function alert(_x3) {
            return ref.apply(this, arguments);
        }

        return alert;
    }();

    var postMessage = function () {
        var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee5(txt) {
            return regeneratorRuntime.wrap(function _callee5$(_context5) {
                while (1) {
                    switch (_context5.prev = _context5.next) {
                        case 0:
                            console.log("en alert");

                            if (!(oo.ui && oo.ui.dialogs && oo.ui.dialogs.postMessage)) {
                                _context5.next = 3;
                                break;
                            }

                            return _context5.abrupt('return', oo.ui.dialogs.postMessage(txt));

                        case 3:
                            throw new Error("Dialog not found");

                        case 4:
                        case 'end':
                            return _context5.stop();
                    }
                }
            }, _callee5, this);
        }));

        function postMessage(_x4) {
            return ref.apply(this, arguments);
        }

        return postMessage;
    }();

    var PushReceiver = function PushReceiver() {
        _classCallCheck(this, PushReceiver);

        var self = this;
        self.socket = io({ path: __baseurl__ + '/socket.io' });
        self.socket.on('askYesNo', function () {
            var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee6(data, fn) {
                var r;
                return regeneratorRuntime.wrap(function _callee6$(_context6) {
                    while (1) {
                        switch (_context6.prev = _context6.next) {
                            case 0:
                                _context6.next = 2;
                                return oo.askYesNo(data);

                            case 2:
                                r = _context6.sent;
                                if (fn) fn(r);
                            case 4:
                            case 'end':
                                return _context6.stop();
                        }
                    }
                }, _callee6, this);
            }));

            return function (_x5, _x6) {
                return ref.apply(this, arguments);
            };
        }());
        self.socket.on('inputString', function () {
            var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee7(data, fn) {
                var r;
                return regeneratorRuntime.wrap(function _callee7$(_context7) {
                    while (1) {
                        switch (_context7.prev = _context7.next) {
                            case 0:
                                _context7.next = 2;
                                return oo.inputString(data);

                            case 2:
                                r = _context7.sent;
                                if (fn) fn(r);
                            case 4:
                            case 'end':
                                return _context7.stop();
                        }
                    }
                }, _callee7, this);
            }));

            return function (_x7, _x8) {
                return ref.apply(this, arguments);
            };
        }());
        //self.socket.on('inputString', async function (data) {self.socket.emit('response',await oo.inputString(data))});
        self.socket.on('alert', function () {
            var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee8(data, fn) {
                var r;
                return regeneratorRuntime.wrap(function _callee8$(_context8) {
                    while (1) {
                        switch (_context8.prev = _context8.next) {
                            case 0:
                                _context8.next = 2;
                                return oo.alert(data);

                            case 2:
                                r = _context8.sent;
                                if (fn) fn(r);
                            case 4:
                            case 'end':
                                return _context8.stop();
                        }
                    }
                }, _callee8, this);
            }));

            return function (_x9, _x10) {
                return ref.apply(this, arguments);
            };
        }());
        self.socket.on('postMessage', function () {
            var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee9(data, fn) {
                var r;
                return regeneratorRuntime.wrap(function _callee9$(_context9) {
                    while (1) {
                        switch (_context9.prev = _context9.next) {
                            case 0:
                                _context9.next = 2;
                                return oo.postMessage(data);

                            case 2:
                                r = _context9.sent;
                                if (fn) fn(r);
                            case 4:
                            case 'end':
                                return _context9.stop();
                        }
                    }
                }, _callee9, this);
            }));

            return function (_x11, _x12) {
                return ref.apply(this, arguments);
            };
        }());
    };

    var oo = {
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
        pushreceiver: new PushReceiver()
    };

    //ready: ready,
    fetchCurrentUser();

    window.oo = oo;
    window.require = require;
    //$.extend(true, window, {require: require, oo: oo})
})(jQuery);

//# sourceMappingURL=openorange.js.map