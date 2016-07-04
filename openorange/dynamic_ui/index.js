"use strict"

var express = require('express');
var path = require('path');
let request = require("request")
var router = express.Router();
let jade = require("jade")
let OpenOrangeBaseURL = null;
router.get('/login', function(req, res, next) {
    console.log("123", req.baseUrl)
    res.render(__dirname + '/html/login', { req: req, OpenOrangeBaseURL: OpenOrangeBaseURL});
});

router.get('/logout', function(req, res, next) {
    delete req.session.user
    res.redirect(req.baseUrl + '/')
});

router.get('/', function(req, res, next) {
    res.redirect(req.baseUrl + '/home')
});

router.get('/home', function(req, res, next) {
    request.get(req.query.url, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            let html = jade.render(body, {OpenOrangeBaseURL: OpenOrangeBaseURL}) // Show the HTML for the Google homepage.
            console.log(html)
            res.send(html)
        }
    })
});

router.get('/designer', function(req, res, next) {
    res.render(__dirname + '/html/designer', {OpenOrangeBaseURL: OpenOrangeBaseURL});
});

router.use('/', express.static(path.join(__dirname, '.')));

let config = function config(opts) {
    OpenOrangeBaseURL = opts.OpenOrangeBaseURL;
    return router;
}
module.exports = config;
