const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const joi = require('joi');
const passwordComplexity = require('joi-password-complexity');
const Joi = require('joi');

// Define Schema
const imgQuerySchema = new mongoose.Schema({
    query: {
        type: String,
        required: true,
        trim: true
    },
    rank: {
        type: Number,
        required: true,
        trim: true
    },
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
    displayLink: {
        type: String,
        required: true,
        trim: true
    },
    snippet: {
        type: String,
        required: true,
        trim: true
    },
    distance: {
        type: Number,
        required: true,
        trim: true
    },
    created: {
        type: String,
        required: true,
        trim: true,
    },
    userID: {
        type: String,
        required: true,
        trim: true
    }
})

// querySchema.methods.generateAuthToken = function() {
//     const token = jwt.sign({_id: this.id}, process.env.JWTPRIVATEKEY, {expiresIn: "7d"});
//     return token;
// }

//Model
const imageQueryModel = mongoose.model("imgQuery", imgQuerySchema);

module.exports = {imageQueryModel};