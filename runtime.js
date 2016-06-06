"use strict";

var express = require('express');
var router = express.Router();
var fs = require("fs")
var cm = require('./openorange').classmanager
var orm = require('./openorange').orm
var Record = cm.getClass("Embedded_Record")
var path = require("path")
var _ = require('underscore')
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

router.post('/record/:method', function (req, res, next) {
    var params = req.body;
    console.log(params.calltype)
    console.log(params.self)
    console.log(params.params)
    var rec;
    if (params.calltype == 'instance') {
        rec = Record.fromJSON(params.self)
    } else {
        rec = cm.getClass(params.recordclass);
    }
    res.setHeader('Content-Type', 'application/json');
    rec[params.method].apply(rec, params.params)
        .then(function (response) {
            if (params.calltype == 'instance') {
                res.send({ok: true, self: JSON.stringify(rec), response: response});
            } else {
                res.send({ok: true, response: response});
            }
        })
        .catch(function (err) {
            res.send({ok: false, error: err})
        });
});


router.get('/class', function (req, res, next) {
    var cls = cm.getClass(req.query.name, req.query.max_script_dir_index);
    var fn = cls.__filename__;
    sendModule(res, fn);
});

router.get('/parentclass', function (req, res, next) {
    var cls = cm.getParentClassFor(req.query.name, req.query.parent, req.query.dirname)
    var fn = cls.__filename__;
    sendModule(res, fn);
    console.log(fn)
});

router.get('/module', function (req, res, next) {
    var fn = req.query.url + ".js"
    sendModule(res, fn);
});

router.get('/select', function (req, res, next) {
    var recordname = 'Customer'
    var recClass = cm.getClass(recordname);
    recClass.select()
        .then(function (records) {
            res.send({ok:true, records: _(records).map(function (rec) {return JSON.stringify(rec)}) });
        })
        .catch(function (err) {
            console.log(err)
            res.send({ok: false, error: err})
        });
});

module.exports = router;