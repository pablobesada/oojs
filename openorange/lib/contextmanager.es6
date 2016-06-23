let continuationLocalStorage = require('continuation-local-storage')
let contextSession = continuationLocalStorage.createNamespace('contextSession');

class ContextManager {

    static expressMiddleware() {

        return function(req, res, next) {
            contextSession.bindEmitter(req);
            contextSession.bindEmitter(res);
            //console.log("en middleware")
            contextSession.run(function() {
                //console.log("en middleware 2", req.session, req.session.user)
                //console.log("req.sessionID: ", req.sessionID, "   session.id: " + req.session.id)
                contextSession.set('session', req.session);

                next();
            });

        };
    }

    static getSession() {
        return contextSession.get('session') || {id: '123'};
    }

    static async getDBConnection() {
        let session = this.getSession();
        console.log("SID: " + session.id)
        if (!this.dbconnections[session.id]) this.dbconnections[session.id] = []
        let connections = this.dbconnections[session.id];
        for (let i in connections) {
            let conn = connections[i];
            if (!conn.busy) {
                //console.log("returing existing: ", conn)
                return conn;
            }
        }
        let conn = await require("./db").getConnection();
        this.dbconnections[session.id].push(conn)
        return conn;
    }

    static async beginTransaction() {
        let conn = await this.getDBConnection();
        return conn.beginTransaction();
    }

    static async commit() {
        let conn = await this.getDBConnection();
        return conn.commit();
    }

    static async rollback() {
        let conn = await this.getDBConnection();
        return conn.rollback();
    }


}
ContextManager.dbconnections = {}

module.exports = ContextManager