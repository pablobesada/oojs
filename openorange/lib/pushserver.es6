"use strict"
let oo = require('openorange')
let Promise = require("bluebird")

class PushServer {
    constructor(socketIO) {
        let self = this;
        this.io = socketIO
        this.clientconnections = [];
        this.io.on('connection', function (client) {
            self.clientconnections[client.request.session.id] = client
        });
    };


    getClientConnection() {
        let session = oo.contextmanager.getRequestSession();
        return this.clientconnections[session.id];
    }

    emit(eventName, data) {
        let client = this.getClientConnection();
        client.emit(eventName, data);
    }

    async ask(eventName, data) {
        let promise = Promise.pending()
        let client = this.getClientConnection();
        let context = oo.contextmanager.getContext()
        let responseListener = function (response) {
            promise.resolve(response)
        }
        client.emit(eventName, data, context.bind(responseListener));
        return promise.promise;
    }

    broadcast(eventName, data) {
        let client = this.getClientConnection();
        if (client) client.broadcast.emit(eventName, data);

    }

}


module.exports = function (httpServer) {
    return new PushServer(httpServer)
}