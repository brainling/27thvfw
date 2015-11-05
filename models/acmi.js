'use strict';

var mongoose = require('mongoose');
var schema = new mongoose.Schema({
    title: { required: true, type: String, min: 3, max: 128 },
    details: { type: String, max: 2048 },
    pilots: { type: [String] },
    tags: { type: [String], index: true },
    files: { type: [String] }
});

var model = mongoose.model('Acmi', schema, 'acmis');
module.exports = model;
