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

module.exports = router;
