"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var cm = require('openorange').classmanager;

var Description = {
    name: 'ClientRecord',
    inherits: 'Embedded_Record',
    fields: {
        syncVersion: { type: "integer" }
    },
    filename: __filename
};

var Parent = cm.SuperClass(Description);

var ClientRecord = function (_Parent) {
    _inherits(ClientRecord, _Parent);

    function ClientRecord() {
        _classCallCheck(this, ClientRecord);

        return _possibleConstructorReturn(this, Object.getPrototypeOf(ClientRecord).call(this));
    }

    _createClass(ClientRecord, [{
        key: 'load',
        value: function () {
            var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
                return regeneratorRuntime.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                return _context.abrupt('return', this.runInServer("load"));

                            case 1:
                            case 'end':
                                return _context.stop();
                        }
                    }
                }, _callee, this);
            }));

            function load() {
                return ref.apply(this, arguments);
            }

            return load;
        }()
    }, {
        key: 'store',
        value: function () {
            var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee2() {
                return regeneratorRuntime.wrap(function _callee2$(_context2) {
                    while (1) {
                        switch (_context2.prev = _context2.next) {
                            case 0:
                                return _context2.abrupt('return', this.runInServer("store"));

                            case 1:
                            case 'end':
                                return _context2.stop();
                        }
                    }
                }, _callee2, this);
            }));

            function store() {
                return ref.apply(this, arguments);
            }

            return store;
        }()
    }, {
        key: 'save',
        value: function () {
            var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee3() {
                return regeneratorRuntime.wrap(function _callee3$(_context3) {
                    while (1) {
                        switch (_context3.prev = _context3.next) {
                            case 0:
                            case 'end':
                                return _context3.stop();
                        }
                    }
                }, _callee3, this);
            }));

            function save() {
                return ref.apply(this, arguments);
            }

            return save;
        }()
    }, {
        key: 'ppp',

        //return this.runInServer("save");
        // por ahora vamos al servidor solo en el store. ojo que si vamos al servidor con el save, hay que tener en cuenta:
        // 1. save de registros locals
        // 2. alerts, mensajes y inputs al usuario durante el proceso de grabado
        value: function () {
            var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee4() {
                return regeneratorRuntime.wrap(function _callee4$(_context4) {
                    while (1) {
                        switch (_context4.prev = _context4.next) {
                            case 0:
                                return _context4.abrupt('return', this.runInServer("ppp"));

                            case 1:
                            case 'end':
                                return _context4.stop();
                        }
                    }
                }, _callee4, this);
            }));

            function ppp() {
                return ref.apply(this, arguments);
            }

            return ppp;
        }()
    }, {
        key: 'runInServer',
        value: function () {
            var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee5(methodname, params) {
                var rec, data;
                return regeneratorRuntime.wrap(function _callee5$(_context5) {
                    while (1) {
                        switch (_context5.prev = _context5.next) {
                            case 0:
                                rec = this;
                                data = {};

                                if ('__isnew__' in rec) {
                                    data.calltype = 'instance';
                                    data.self = JSON.stringify(rec.toJSON());
                                } else {
                                    data.calltype = 'class';
                                    data.recordclass = this.__description__.name;
                                }
                                data.method = methodname;
                                data.params = params != null ? params : [];
                                return _context5.abrupt('return', new Promise(function (resolve, reject) {
                                    var url = '/runtime/record/' + methodname;
                                    $.ajax({
                                        type: "POST",
                                        url: url,
                                        contentType: 'application/json; charset=utf-8',
                                        dataType: "json",
                                        async: true,
                                        data: JSON.stringify(data),
                                        success: function success(result) {
                                            if (!result.ok) {
                                                reject(result.error);
                                                return;
                                            }
                                            if (data.calltype == 'instance') {
                                                classmanager.getClass("Record").fromJSON(result.self, rec);
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
                                }));

                            case 6:
                            case 'end':
                                return _context5.stop();
                        }
                    }
                }, _callee5, this);
            }));

            function runInServer(_x, _x2) {
                return ref.apply(this, arguments);
            }

            return runInServer;
        }()
    }]);

    return ClientRecord;
}(Parent);

module.exports = ClientRecord.initClass(Description);

//# sourceMappingURL=ClientRecord.js.map