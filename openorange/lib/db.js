"use strict";
var Promise = require("bluebird")
Promise.config({
    longStackTraces: true
})
var mysql = require('mysql');
// Note that the library's classes are not properties of the main export
// so we require and promisifyAll them manually
//Promise.promisifyAll(require("mysql/lib/Connection").prototype);
//var mysql_pool = Promise.promisifyAll(require("mysql/lib/Pool").prototype);
//var mysql     =    require('mysql');
var db = {}

db.pool     =    mysql.createPool({
    connectionLimit : 100, //important
    host     : 'localhost',
    user     : 'root',
    password : 'rootXy',
    database : 'oo',
    debug    :  false
});
function handle_database(req,res) {

    pool.getConnection(function(err,connection){
        if (err) {
            connection.release();
            res.json({"code" : 100, "status" : "Error in connection database"});
            return;
        }

        console.log('connected as id ' + connection.threadId);

        connection.query("select * from user",function(err,rows){
            connection.release();
            if(!err) {
                res.json(rows);
            }
        });

        connection.on('error', function(err) {
            res.json({"code" : 100, "status" : "Error in connection database"});
            return;
        });
    });
}

var Connection = Object.create(null);
Connection.init = function init(conn) {
    this.__conn__ = conn
    this.beginTransaction = this.beginTransaction.bind(this)
    this.commit = this.commit.bind(this)
    this.rollback = this.rollback.bind(this)
    return this;
}

Connection.beginTransaction = function beginTransaction () {
    var self = this;
    return new Promise(function (resolve, reject) {
        self.__conn__.beginTransaction(function (err) {
            if (err) {
                reject(err);
                return;
            }
            resolve();
        })
    })
}

Connection.query = function query (sql, values) {
    var self = this;
    return new Promise(function (resolve, reject) {
        self.__conn__.query(sql, values, function (err, result, fields) {
            if (err) {
                reject(err);
                return;
            }
            if (fields != null) {
                resolve([result, fields]);
            } else {
                resolve(result);
            }
        })
    })
}

Connection.commit = function commit() {
    var self = this;
    return new Promise(function (resolve, reject) {
        self.__conn__.commit(function (err) {
            if (err) {
                reject(err)
                return;
            }
            resolve();
        })
    })
}

Connection.rollback = function rollback() {
    var self = this;
    return new Promise(function (resolve, reject) {
        self.__conn__.rollback(function (err) {
            if (err) {
                reject(err)
                return;
            }
            resolve();
        })
    })
}

db.getConnection = function getConnection() {
    return new Promise(function (resolve, reject) {
        db.pool.getConnection(function(err, connection) {
            if (err) {
                connnection.release();
                reject(err);
                return;
            }
            resolve(Object.create(Connection).init(connection));
        })
    })
}



module.exports = db;

