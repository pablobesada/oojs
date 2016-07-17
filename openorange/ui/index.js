"use strict"

var express = require('express');
var path = require('path');
var router = express.Router();
let OpenOrangeBaseURL = null;
router.get('/login', function(req, res, next) {
    res.render(__dirname + '/html/login', { req: req, OpenOrangeBaseURL: OpenOrangeBaseURL});
});

router.get('/logout', function(req, res, next) {
    delete req.session.user //y de redis tambien lo estoy borrando??
    res.redirect(req.baseUrl + '/')
});

router.get('/', function(req, res, next) {
    res.redirect(req.baseUrl + '/home')
});

router.get('/home', function(req, res, next) {
    if (req.session.user) {
        res.render(__dirname + '/html/app', {OpenOrangeBaseURL: OpenOrangeBaseURL});
    } else {
        res.redirect(req.baseUrl + '/login')
    }
});

//router.use('bower_components', express.static(path.join(__dirname, '../../bower_components')));
router.use('/css/', express.static(path.join(__dirname, 'css')));
router.use('/fonts/', express.static(path.join(__dirname, 'fonts'), { maxAge: 60*60*24*7*1000}));
router.use('/images/', express.static(path.join(__dirname, 'images'), { maxAge: 60*60*24*7*1000}));
router.use('/html/', express.static(path.join(__dirname, 'html')));
router.use('/js/oo/', express.static(path.join(__dirname, 'js/oo')));
router.use('/js/plugins/', express.static(path.join(__dirname, 'js/plugins'), { maxAge: 60*60*24*7*1000}));
router.use('/js/', express.static(path.join(__dirname, 'js')));


let config = function config(opts) {
    OpenOrangeBaseURL = opts.OpenOrangeBaseURL;
    return router;
}
module.exports = config;
