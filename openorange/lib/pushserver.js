"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var oo = require('openorange');
var Promise = require("bluebird");

var PushServer = function () {
    function PushServer(socketIO) {
        _classCallCheck(this, PushServer);

        var self = this;
        this.io = socketIO;
        this.clientconnections = [];
        this.io.on('connection', function (client) {
            self.clientconnections[client.request.session.id] = client;
        });
    }

    _createClass(PushServer, [{
        key: "getClientConnection",
        value: function getClientConnection() {
            var session = oo.contextmanager.getRequestSession();
            return this.clientconnections[session.id];
        }
    }, {
        key: "emit",
        value: function emit(eventName, data) {
            var client = this.getClientConnection();
            client.emit(eventName, data);
        }
    }, {
        key: "ask",
        value: function () {
            var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(eventName, data) {
                var promise, client, context, responseListener;
                return regeneratorRuntime.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                promise = Promise.pending();
                                client = this.getClientConnection();
                                context = oo.contextmanager.getContext();

                                responseListener = function responseListener(response) {
                                    promise.resolve(response);
                                };

                                client.emit(eventName, data, context.bind(responseListener));
                                return _context.abrupt("return", promise.promise);

                            case 6:
                            case "end":
                                return _context.stop();
                        }
                    }
                }, _callee, this);
            }));

            function ask(_x, _x2) {
                return ref.apply(this, arguments);
            }

            return ask;
        }()
    }, {
        key: "broadcast",
        value: function broadcast(eventName, data) {
            var client = this.getClientConnection();
            if (client) client.broadcast.emit(eventName, data);
        }
    }]);

    return PushServer;
}();

module.exports = function (httpServer) {
    return new PushServer(httpServer);
};

//# sourceMappingURL=pushserver.js.map