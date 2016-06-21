"use strict";
//require('source-map-support').install();
var Promise = require("bluebird")
/*Promise.config({
 longStackTraces: true
 })*/
var mysql = require('mysql');
// Note that the library's classes are not properties of the main export
// so we require and promisifyAll them manually
//Promise.promisifyAll(require("mysql/lib/Connection").prototype);
//var mysql_pool = Promise.promisifyAll(require("mysql/lib/Pool").prototype);
//var mysql     =    require('mysql');
var db = {}

db.pool = mysql.createPool({
    connectionLimit: 100, //important
    host: 'localhost',
    user: 'root',
    password: 'rootXy',
    database: 'oo',
    debug: false
});
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
        this.log_queries = true;
        this.__conn__ = conn
        this.beginTransaction = this.beginTransaction.bind(this)
        this.commit = this.commit.bind(this)
        this.rollback = this.rollback.bind(this)
        return this;
    }

    async beginTransaction() {
        var self = this;
        return new Promise(function (resolve, reject) {
            if (self.log_queries) console.log("BEGIN TRANSACTION")
            self.__conn__.beginTransaction(function (err) {
                if (err) {
                    reject(err);
                    return;
                }
                resolve();
            })
        })
    }

    async query(sql, values) {
        var self = this;
        return new Promise(function (resolve, reject) {
            if (self.log_queries) console.log(sql, values)
            self.__conn__.query(sql, values, function (err, result, fields) {

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
            if (self.log_queries) console.log("COMMIT")
            self.__conn__.commit(function (err) {
                if (err) {
                    reject(err)
                    return;
                }
                resolve();
            })
        })
    }

    async rollback() {
        var self = this;
        return new Promise(function (resolve, reject) {
            if (self.log_queries) console.log("ROLLBACK")
            self.__conn__.rollback(function (err) {
                if (err) {
                    reject(err)
                    return;
                }
                resolve();
            })
        })
    }

    release() {
        var self = this;
        self.__conn__.release();
        self.__conn__ = null;
        //console.log("releasing connection");
    }
}

db.getConnection = async function getConnection() {
    return new Promise(function (resolve, reject) {
        db.pool.getConnection(function (err, connection) {
            if (err) {
                if (connection) {
                    connnection.release();
                }
                reject(err);
                return;
            }
            //console.log("returning new connection");
            resolve(new Connection(connection));
        })
    })
}


module.exports = db;

