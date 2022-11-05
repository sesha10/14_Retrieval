const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const joi = require('joi');
const passwordComplexity = require('joi-password-complexity');
const Joi = require('joi');

// Define Schema
const userSchema = new mongoose.Schema({
    userID: {
        type: String,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        trim: true
    },
})

userSchema.methods.generateAuthToken = function() {
    const token = jwt.sign({_id: this.id}, process.env.JWTPRIVATEKEY, {expiresIn: "7d"});
    return token;
}

//Model
const UserModel = mongoose.model("user", userSchema);

const validate = (data) => {
    const schema = Joi.object({
        userID: Joi.string().required().label("userID"),
        password: passwordComplexity().required().label("password"),
    })
    return schema.validate(data);
}

module.exports = {UserModel, validate};