let continuationLocalStorage = require('continuation-local-storage')
let context = continuationLocalStorage.createNamespace('openorange-async-session-context');

class ContextManager {

    static expressMiddleware() {

        return function(req, res, next) {
            context.bindEmitter(req);
            context.bindEmitter(res);
            //console.log("en middleware")
            context.run(function() {
                //console.log("en middleware 2", req.session)
                //console.log("req.sessionID: ", req.sessionID, "   session.id: " + req.session.id)
                context.set('request-session', req.session);
                next();
            });

        };
    }

    static getRequestSession() {
        return context.get('request-session') || {id: 'local-session'};
    }

    static async getDBConnection() {
        let session = this.getRequestSession();
        //console.log("SID: " + session.id)
        let sid = session.id
        //sid = '123'
        if (!this.dbconnections[sid]) this.dbconnections[sid] = []
        let connections = this.dbconnections[sid];
        for (let i in connections) {
            let conn = connections[i];
            if (!conn.busy) {
                return conn;
            }
        }
        let conn = await require("./db").getConnection();
        this.dbconnections[sid].push(conn)
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

    static currentUser() {
        let session = this.getRequestSession()
        return session.user;
    }


}
ContextManager.dbconnections = {}

module.exports = ContextManager