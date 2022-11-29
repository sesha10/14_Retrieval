const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const joi = require('joi');
const passwordComplexity = require('joi-password-complexity');
const Joi = require('joi');

// Define Schema
const historySchema = new mongoose.Schema({
    link: {
        type: String,
        required: true,
        trim: true
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    userID: {
        type: String,
        required: true,
        trim: true
    }
})

//Model
const historyModel = mongoose.model("History", historySchema);

module.exports = {historyModel};