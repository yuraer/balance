"use strict";

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RegistrSchema = new Schema({
    username: {type: String, required: true},
    operationType: {type: String, required: true},
    description: {type: String},
    currency: {type: String, required: true},
    date: {type: Date,  "default": Date.now},
    sum: {type: Number, required: true}
    }, {
    versionKey: false,
    collection: "RegistrCollection"
});

module.exports = mongoose.model('RegistrModel', RegistrSchema);