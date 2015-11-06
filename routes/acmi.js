'use strict';

var express = require('express');
var router = express.Router();
var acmi = require('../models/acmi');

router.get('/', function(req, res) {
    acmi.find().exec(function(err, acmis) {
        if(err) {
            throw err;
        }

        res.render('acmi/index', {
            title: 'ACMI Log',
            acmis: acmis || []
        });
    });
});

router.get('/new', function(req, res) {
    res.render('acmi/new', {
        title: 'ACMI Log'
    });
});

router.post('/new', function(req, res) {
    res.redirect('/acmi');
});

module.exports = router;
