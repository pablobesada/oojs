"use strict";
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

db.getConnection = function getConnection() {
    return new Promise(function (resolve, reject) {
        db.pool.getConnection(function(err, connection) {
            if (err) {
                connnection.release();
                reject(err);
                return;
            }
            resolve(connection);
        })
    })
}



module.exports = db;

