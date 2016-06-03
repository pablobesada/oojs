var express = require('express');
var router = express.Router();

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

router.get('/admin/admin', function(req, res, next) {
    //req.session.test = 123
    res.render('admin', { title: 'Express' });
});

module.exports = router;
