"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function ($) {
    var Dialogs = function () {
        function Dialogs() {
            _classCallCheck(this, Dialogs);
        }

        _createClass(Dialogs, null, [{
            key: 'askYesNo',
            value: function () {
                var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(txt) {
                    var promise, id, html, dialogElement;
                    return regeneratorRuntime.wrap(function _callee$(_context) {
                        while (1) {
                            switch (_context.prev = _context.next) {
                                case 0:
                                    promise = Promise.pending();
                                    id = 'DIALOG_' + Dialogs.element_ids++;
                                    html = '\n                    <div id="' + id + '" class="modal bottom-sheet">\n                        <div class="modal-content">\n                            <h4></h4>\n                            <p>' + txt + '</p>\n                        </div>\n                        <div class="modal-footer green">\n                            <a href="#" onclick="oo.ui.dialogs.resolve(\'' + id + '\', true)" class=" modal-action modal-close waves-effect waves-green btn-flat">Yes</a>\n                            <a href="#" onclick="oo.ui.dialogs.resolve(\'' + id + '\', false)" class=" modal-action modal-close waves-effect waves-green btn-flat">No</a>\n                        </div>\n                    </div>';
                                    dialogElement = $(html);

                                    $(document.body).append(dialogElement);
                                    Dialogs.promises[id] = promise;
                                    dialogElement.openModal({ dismissible: false });
                                    return _context.abrupt('return', promise.promise);

                                case 8:
                                case 'end':
                                    return _context.stop();
                            }
                        }
                    }, _callee, this);
                }));

                function askYesNo(_x2) {
                    return ref.apply(this, arguments);
                }

                return askYesNo;
            }()
        }, {
            key: 'inputString',
            value: function () {
                var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(txt) {
                    var promise, id, html, dialogElement;
                    return regeneratorRuntime.wrap(function _callee2$(_context2) {
                        while (1) {
                            switch (_context2.prev = _context2.next) {
                                case 0:
                                    promise = Promise.pending();
                                    id = 'DIALOG_' + Dialogs.element_ids++;
                                    html = '\n                    <div id="' + id + '" class="modal bottom-sheet">\n                        <div class="modal-content">\n                            <h4></h4>\n                            <p>' + txt + '</p>\n                            <form onsubmit="oo.ui.dialogs.resolve(\'' + id + '\', $(\'#' + id + '_INPUT\').val());return false;">\n                                <div class="form-field">\n                                    <input type="text" id="' + id + '_INPUT">\n                                </div>\n                            </form>\n                        </div>\n                    </div>';
                                    dialogElement = $(html);

                                    $(document.body).append(dialogElement);
                                    Dialogs.promises[id] = promise;
                                    dialogElement.openModal({ dismissible: false,
                                        ready: function ready() {
                                            dialogElement.find('#' + id + "_INPUT").focus();
                                        }
                                    });

                                    return _context2.abrupt('return', promise.promise);

                                case 8:
                                case 'end':
                                    return _context2.stop();
                            }
                        }
                    }, _callee2, this);
                }));

                function inputString(_x3) {
                    return ref.apply(this, arguments);
                }

                return inputString;
            }()
        }, {
            key: 'alert',
            value: function (_alert) {
                function alert(_x) {
                    return _alert.apply(this, arguments);
                }

                alert.toString = function () {
                    return _alert.toString();
                };

                return alert;
            }(function () {
                var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee3(txt) {
                    return regeneratorRuntime.wrap(function _callee3$(_context3) {
                        while (1) {
                            switch (_context3.prev = _context3.next) {
                                case 0:
                                    alert(txt);

                                case 1:
                                case 'end':
                                    return _context3.stop();
                            }
                        }
                    }, _callee3, this);
                }));

                return function (_x4) {
                    return ref.apply(this, arguments);
                };
            }())
        }, {
            key: 'postMessage',
            value: function () {
                var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee4(txt) {
                    return regeneratorRuntime.wrap(function _callee4$(_context4) {
                        while (1) {
                            switch (_context4.prev = _context4.next) {
                                case 0:
                                    Materialize.toast(txt, 4000);

                                case 1:
                                case 'end':
                                    return _context4.stop();
                            }
                        }
                    }, _callee4, this);
                }));

                function postMessage(_x5) {
                    return ref.apply(this, arguments);
                }

                return postMessage;
            }()
        }, {
            key: 'resolve',
            value: function () {
                var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee5(id, result) {
                    return regeneratorRuntime.wrap(function _callee5$(_context5) {
                        while (1) {
                            switch (_context5.prev = _context5.next) {
                                case 0:
                                    $('#' + id).closeModal();
                                    $('#' + id).remove();
                                    Dialogs.promises[id].resolve(result);
                                    //delete Dialogs.promises[id]

                                case 3:
                                case 'end':
                                    return _context5.stop();
                            }
                        }
                    }, _callee5, this);
                }));

                function resolve(_x6, _x7) {
                    return ref.apply(this, arguments);
                }

                return resolve;
            }()
        }]);

        return Dialogs;
    }();

    Dialogs.promises = {};
    Dialogs.element_ids = 1;

    window.oo.ui.dialogs = Dialogs;
    //window.WindowManager = WindowContainer; //para hacer global la variable WindowManager
})(jQuery);

//# sourceMappingURL=dialogs.js.map