"use strict";

var express = require('express');
var router = express.Router();
var fs = require("fs")
var cm = require.main.require('./openorange').classmanager
var Record = cm.getClass("Embedded_Record")
var path = require("path")
/* GET users listing. */

function sendModule(res, fn) {
    fs.readFile(fn, 'utf8', function (err, data) {
        if (err) {
            return console.log(err);
        }
        var fulldata = "var moduleFunction = (function() {module = {};\n";
        fulldata = fulldata + "var __dirname = '" + path.dirname(fn) + "';\n"
        fulldata = fulldata + "var __filename = '" + fn + "';\n"
        fulldata = fulldata + data + "\nreturn module.exports;})";
        res.status(200).send(fulldata)
    });
}

router.post('/load', function (req, res, next) {
    console.log(req.body)
    var rec = Record.fromJSON(req.body)
    rec.load(function (err) {
        res.setHeader('Content-Type', 'application/json');
        if (err != null){
            //aca que devuelvo?
            res.send({ok: false, error: "record not found"})
            return;
        }
        res.send({ok:true, rec: JSON.stringify(rec)});
        return;

    })
});

router.post('/save', function (req, res, next) {
    console.log(req.body)
    var rec = Record.fromJSON(req.body)
    rec.save(function (err) {
        res.setHeader('Content-Type', 'application/json');
        if (err != null){
            //aca que devuelvo?
            res.send({ok: false, error: err})
            return;
        }
        res.send({ok:true, rec: JSON.stringify(rec)});
        return;

    })
});

router.get('/class', function (req, res, next) {
    var cls = cm.getClass(req.query.name, req.query.max_script_dir_index);
    var fn = cls.__filename__;
    console.log(fn)
    sendModule(res, fn);
});


router.get('/parentclass', function (req, res, next) {
    var cls = cm.getParentClassFor(req.query.name, req.query.parent, req.query.dirname)
    var fn = cls.__filename__;
    sendModule(res, fn);
    console.log(fn)
});

module.exports = router;