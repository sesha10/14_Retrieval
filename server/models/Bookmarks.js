const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const joi = require('joi');
const passwordComplexity = require('joi-password-complexity');
const Joi = require('joi');

// Define Schema
const bookmarkSchema = new mongoose.Schema({
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

// querySchema.methods.generateAuthToken = function() {
//     const token = jwt.sign({_id: this.id}, process.env.JWTPRIVATEKEY, {expiresIn: "7d"});
//     return token;
// }

//Model
const bookmarkModel = mongoose.model("Bookmarks", bookmarkSchema);

module.exports = {bookmarkModel};