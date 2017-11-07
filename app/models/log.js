'use strict';

var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var LogSchema = new Schema({
    userId: {
        type: String,
        required: true
    },
    courseId: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    event:
     {
        type: String,
        required: true
    },
    meta:
     {
        type: Schema.Types.Mixed,
        required: true
    }
});

module.exports = mongoose.model('Log', LogSchema);