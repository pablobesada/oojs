"use strict";

var express = require('express');
var router = express.Router();
var fs = require("fs")
var oo = require('openorange')
var cm = oo.classmanager
var orm = require('./orm')
var Record = cm.getClass("Embedded_Record")
var path = require("path")
var _ = require('underscore')
//var babel = require("babel-core")


for (let i=0;i<cm.reversed_scriptdirs.length;i++){
    //esto es xq el navegador pide los archivos .map.js para debugging por consola
    let sd = cm.reversed_scriptdirs[i];
    console.log(i, sd)
    router.use('/sources/'+sd, express.static(path.join(__dirname, '../..', sd )));
}
router.use('/', oo.contextmanager.expressMiddleware()); //aca manejan usuario actual, conexion actual, etc. para ser usadas con toda la app. Son variables definidas por request/cookie

router.use('/lib/client', express.static(path.join(__dirname, 'client')));
router.use('/lib/both', express.static(path.join(__dirname, 'both')));

function extractSDRelativePath(fn) {
    for (var i in cm.reversed_scriptdirs) {
        var sd = cm.reversed_scriptdirs[i];
        var idx = fn.lastIndexOf("/"+sd+"/")
        if (idx >= 0) {
            return fn.substring(idx);
        }
    }
    return null;
}

function sendModule(req, res, fn) {
    fs.readFile(fn, 'utf8', function (err, data) {
        if (err) {
            return console.log(err);
        }
        let relative_fn = extractSDRelativePath(fn);
        var fulldata = "var moduleFunction = (function() {module = {};\n";
        fulldata = fulldata + "var __dirname = '" + path.dirname(relative_fn) + "';\n"
        fulldata = fulldata + "var __filename = '" + relative_fn + "';\n"
        fulldata = fulldata + data + "\nreturn module.exports;})\n";
        fulldata = fulldata + `//# sourceURL= ${req.baseUrl}/sources${relative_fn}`;
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


router.get('/classStructure', function (req, res, next) {
    try {
        res.send({ok: true, response: cm.getClassStructure()});
    } catch (err) {
        console.log(err.stack);
        throw err;
    }
});

router.get('/class', function (req, res, next) {
    try {
        var cls = cm.getClass(req.query.name, {min_sd: req.query.min_sd, max_sd: req.query.max_sd});
        if (cls) {
            var fn = cls.__description__.filename || cls.__filename__;
            sendModule(req, res, fn);
        } else throw new Error("Class not found: "+  req.query.name + " for min_script_dir: " + req.query.min_script_dir_index)
    } catch (err) {
        console.log(err.stack);
        throw err;
    }
});

router.get('/parentclass', function (req, res, next) {
    try {
        var cls = cm.getParentClassFor(req.query.name, req.query.parent, req.query.dirname)
        var fn = cls.__description__.filename || cls.__filename__;
        sendModule(req, res, fn);
        //console.log(fn)
    } catch (err) {
        console.log(err.stack);
        throw err;
    }
});

router.get('/module', function (req, res, next) {
    var fn = req.query.url + ".js"
    sendModule(req, res, fn);
});

router.get('/select', function (req, res, next) {
    var recordname = 'Customer'
    var recClass = cm.getClass(recordname);
    recClass.select()
        .then(function (records) {
            res.send({
                ok: true, records: _(records).map(function (rec) {
                    return JSON.stringify(rec)
                })
            });
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
            res.send({ok: true, response: result});
        })
        .catch(function (err) {
            console.log(err.stack)
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
    try {
        oo.login(req.body.username, req.body.md5pass)
            .then(function (found) {
                console.log("en then")
                if (found) {
                    console.log("user found")
                    req.session.user = req.body.username
                    if (req.body.redirect_on_success) {
                        res.redirect(req.body.redirect_on_success)
                    } else {
                        res.send({ok: true})
                    }


                } else {
                    console.log("user not found")
                    res.send({ok: false, error: 'wrong user or password'})
                }
            })
            .catch(function (err) {
                console.log("ERR")
                console.log(err.stack)
            });
    } catch (err) {
        console.log(err.stack)
    }
});

router.post('/oo/rollback', function (req, res, next) {
    oo.rollback()
        .then(function (result) {
            res.send({ok: true, response: result});
        })
        .catch(function (err) {
            console.log(err)
            res.send({ok: false, error: err})
        });
});

router.post('/oo/commit', function (req, res, next) {
    oo.commit()
        .then(function (result) {
            res.send({ok: true, response: result});
        })
        .catch(function (err) {
            console.log(err)
            res.send({ok: false, error: err})
        });
});

router.post('/oo/begintransaction', function (req, res, next) {
    oo.beginTransaction()
        .then(function (result) {
            res.send({ok: true, response: result});
        })
        .catch(function (err) {
            console.log(err)
            res.send({ok: false, error: err})
        });
});
module.exports = router;