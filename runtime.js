"use strict";

var express = require('express');
var router = express.Router();

var fs = require("fs")

var oo = require('openorange')

var cm = oo.classmanager
var orm = oo.orm

var Record = cm.getClass("Embedded_Record")
var path = require("path")
var _ = require('underscore')

var babel = require("babel-core")

function sendModule(res, fn) {
    fs.readFile(fn, 'utf8', function (err, data) {
        if (err) {
            return console.log(err);
        }
        var fulldata = "var moduleFunction = (function() {module = {};\n";
        fulldata = fulldata + "var __dirname = '" + path.dirname(fn) + "';\n"
        fulldata = fulldata + "var __filename = '" + fn + "';\n"
        fulldata = fulldata + data + "\nreturn module.exports;})\n";
        fulldata = fulldata + "//# sourceURL=" + fn;
        //fulldata = babel.transform(fulldata, {"presets": ["stage-3"]}).code
        res.status(200).send(fulldata);
    });
}

router.post('/record/:method', function (req, res, next) {
    var params = req.body;
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
            console.log(err)
        });
});

router.post('/query/fetch', function (req, res, next) {
    var params = req.body;
    res.setHeader('Content-Type', 'application/json');
    var query = oo.query.fromJSON(req.body);
    //console.log(req.body)
    query.fetch()
        .then(function (response) {
            res.send({ok: true, response: response});
        })
        .catch(function (err) {
            res.send({ok: false, error: err})
            console.log(err.stack)
        });
});


router.get('/class', function (req, res, next) {
    try {
        var cls = cm.getClass(req.query.name, req.query.max_script_dir_index);
        var fn = cls.__description__.filename || cls.__filename__;
        sendModule(res, fn);
    } catch (err) {
        console.log(err.stack);
        throw err;
    }
});

router.get('/parentclass', function (req, res, next) {
    try {
        var cls = cm.getParentClassFor(req.query.name, req.query.parent, req.query.dirname)
        var fn = cls.__description__.filename || cls.__filename__;
        sendModule(res, fn);
        //console.log(fn)
    } catch (err) {
        console.log(err.stack);
        throw err;
    }
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

router.get('/explorer/search', function (req, res, next) {
    //console.log(req.query.txt)
    oo.explorer.search(req.query.txt)
        .then(function (result) {
            res.send({ok:true, response: result});
        })
        .catch(function (err) {
            console.log(err)
            res.send({ok: false, error: err})
        });
});


/*
router.post('/login', function (req, res, next) {
    let data = req.body;
    console.log("login user: ", data)
    req.session.user = data.user
    res.send({ok: true})
});
*/

router.get('/getcurrentuser', function (req, res, next) {
    res.send({ok: true, currentuser: req.session.user})
});

router.post('/login', function (req, res, next) {
    console.log(req.body)
    console.log("login user: ", req.body.username)
    req.session.user = req.body.username
    res.redirect("/app")
});

router.post('/oo/rollback', function (req, res, next) {
    oo.rollback()
        .then(function (result) {
            res.send({ok:true, response: result});
        })
        .catch(function (err) {
            console.log(err)
            res.send({ok: false, error: err})
        });
});

router.post('/oo/commit', function (req, res, next) {
    oo.commit()
        .then(function (result) {
            res.send({ok:true, response: result});
        })
        .catch(function (err) {
            console.log(err)
            res.send({ok: false, error: err})
        });
});
module.exports = router;