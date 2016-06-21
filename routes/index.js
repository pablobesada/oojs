"use strict";
var express = require('express');
var router = express.Router();
var fs = require("fs")
var babel = require("babel-core")


/* GET home page. */
router.get('/', function(req, res, next) {
    //req.session.test = 123
    res.render('index', { title: 'Express' });
});

router.get('/react', function(req, res, next) {
    //req.session.test = 123
    res.render('react', { title: 'Express' });
});

router.get('/polymer', function(req, res, next) {
    //req.session.test = 123
    res.render('polymer', { title: 'Express' });
});

router.get('/materialize', function(req, res, next) {
    //req.session.test = 123
    res.render('materialize', { title: 'Express' });
});


router.get('/window', function(req, res, next) {
    //req.session.test = 123
    res.render('window', { title: 'Express' });
});

router.get('/window_test', function(req, res, next) {
    //req.session.test = 123
    res.render('window_test', { title: 'Express' });
});

router.get('/app/index', function(req, res, next) {
    res.render('app', { title: 'Express' });
});

router.get('/XXXopenorange/lib/:fn', function(req, res, next) {
    fs.readFile("./node_modules/openorange/lib/" + req.params.fn, 'utf8', function (err, data) {
        res.send(babel.transform(data, {"presets": ["stage-3"]}).code)
    });
});

module.exports = router;
