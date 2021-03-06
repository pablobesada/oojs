"use strict";
//require('source-map-support').install();
let Promise = require("bluebird")
/*Promise.config({
 longStackTraces: true
 })*/
let mysql = require('mysql');

var db = {}
db.init = function init(opts) {
    db.pool = mysql.createPool({
        connectionLimit: 100, //important
        host: opts.host,
        user: opts.user,
        password: opts.password,
        database: opts.database,
        debug: false
    });
}

function handle_database(req, res) {

    pool.getConnection(function (err, connection) {
        if (err) {
            connection.release();
            res.json({"code": 100, "status": "Error in connection database"});
            return;
        }

        console.log('connected as id ' + connection.threadId);

        connection.query("select * from user", function (err, rows) {
            connection.release();
            if (!err) {
                res.json(rows);
            }
        });

        connection.on('error', function (err) {
            res.json({"code": 100, "status": "Error in connection database"});
            return;
        });
    });
}

class Connection {

    constructor(conn) {
        this.id = Connection.__nextid__++;
        this.log_queries = true;
        this.log_query_values = true;
        this.__conn__ = conn
        this.busy = false;
        if (this.log_queries) console.log(`(${this.id}) NEW connnection`)
        return this;
    }

    async beginTransaction() {
        var self = this;
        return new Promise(function (resolve, reject) {
            if (self.log_queries) console.log(`(${self.id}) BEGIN TRANSACTION`)
            self.busy = true;
            self.__conn__.beginTransaction(function (err) {
                self.busy = false;
                if (err) {
                    reject(err);
                    return;
                }
                resolve(true);
            })
        })
    }

    async query(sql, values) {
        var self = this;
        return new Promise(function (resolve, reject) {
            if (self.log_queries) console.log(`(${self.id}) ${sql}`)
            if (self.log_query_values && values) console.log(values)
            self.busy = true;
            self.__conn__.query(sql, values, function (err, result, fields) {
                self.busy = false;
                if (err) {
                    console.log(err)
                    console.log(sql)
                    console.log(values)
                    reject(err);
                    return;
                }
                if (fields != null) {//SELECTS por ejemplo
                    resolve([result, fields]);
                } else { //UPDATES POR EJEMPLO
                    resolve(result)
                }
            })
        })
    }

    async commit() {
        var self = this;
        return new Promise(function (resolve, reject) {
            if (self.log_queries) console.log(`(${self.id}) COMMIT`)
            self.busy = true;
            self.__conn__.commit(function (err) {
                self.busy = false;
                if (err) {
                    reject(err)
                    return;
                }
                resolve(true);
            })
        })
    }

    async rollback() {
        var self = this;
        return new Promise(function (resolve, reject) {
            if (self.log_queries) console.log(`(${self.id}) ROLLBACK`)
            self.busy = true;
            self.__conn__.rollback(function (err) {
                self.busy = false;
                if (err) {
                    reject(err)
                    return;
                }
                resolve(true);
            })
        })
    }

    release() {
        var self = this;
        if (self.log_queries)  console.log(`(${self.id}) RELEASING connnection`)
        self.__conn__.release();
        self.__conn__ = null;
        //console.log("releasing connection");
    }
}
Connection.__nextid__ = 1;

db.getConnection = async function getConnection() {
    var self = this;
    return new Promise(function (resolve, reject) {
        db.pool.getConnection(function (err, connection) {
            if (err) {
                if (connection) {
                    connnection.release();
                }
                reject(err);
                return;
            }
            let res = new Connection(connection);
            if (!connection.reusing) {
                connection.reusing = true;
                res.query("SET SESSION TRANSACTION ISOLATION LEVEL REPEATABLE READ")
                    .then(function () {return res.query("SET AUTOCOMMIT=0;")})
                    .then(function () {resolve(res)})
            } else {
                resolve(res)
            }

        })
    })
}

db.disconnect = function disconnect() {
    db.pool.end();
}

module.exports = db;

