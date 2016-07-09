"use strict"
let oo = require('openorange')
let Promise = require("bluebird")

class PushServer {
    constructor(socketIO) {
        let self = this;
        this.io = socketIO
        this.clientconnections = []; //ver cuando y como se limpia este array!!!
        this.io.on('connection', function (socket) {
            if (!(socket.request.session.id in self.clientconnections)) {
                self.clientconnections[socket.request.session.id] = {socket: socket, msg_queue: []}
            } else {
                self.clientconnections[socket.request.session.id].socket = socket;
            }
            let client = self.getClientConnection();
            while (client.msg_queue.length) {
                let msg = client.msg_queue.shift();
                switch (msg.type) {
                    case 'emit':
                        self.emit(msg.eventName, msg.data);
                        break;
                    case 'broadcast':
                        self.broadcast(msg.eventName, msg.data);
                        break;
                    case 'ask':
                        self.ask(msg.eventName, msg.data, msg.promise);
                        break;
                }
            }

            socket.on('BROADCAST_REQUEST', function (data) {
                socket.broadcast.emit("BROADCAST", `${socket.request.session.user}: ${data}`)
            })
            socket.on('ENTITY', function (data) {
                oo.eventmanager.emit(data.eventName, data.event)
                socket.broadcast.emit("ENTITY", data)
            })
        });
    };

    getClientConnection() {
        let session = oo.contextmanager.getRequestSession();
        if (!(session.id in this.clientconnections)) this.clientconnections[session.id] = {socket: null, msg_queue: []}
        return this.clientconnections[session.id];
    }

    emit(eventName, data) {
        let client = this.getClientConnection();
        if (client.socket) {
            client.socket.emit(eventName, data);
        } else {
            client.msg_queue.push({eventName: eventName, data: data, type: 'emit'})
        }
    }

    async ask(eventName, data, resolveToThisPromise) {
        let promise = resolveToThisPromise || Promise.pending()
        let client = this.getClientConnection();
        if (client.socket) {
            let context = oo.contextmanager.getContext()
            let responseListener = function (response) {
                promise.resolve(response)
            }
            client.socket.emit(eventName, data, context.bind(responseListener));
        } else {
            client.msg_queue.push({eventName: eventName, data: data, type: 'ask', promise: promise})
        }
        return promise.promise;
    }

    broadcast(eventName, data) {
        let client = this.getClientConnection();
        if (client.socket) {
            client.socket.broadcast.emit(eventName, data);
        } else {
            client.msg_queue.push({eventName: eventName, data: data, type: 'broadcast'})
        }
    }

}


module.exports = function (httpServer) {
    return new PushServer(httpServer)
}