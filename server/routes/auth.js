const router = require('express').Router();
const {UserModel, validate} = require('../models/Student');
const Joi = require('joi');
const bcrypt = require('bcrypt');

router.post("/", async(req, res) => {
    try {
        console.log(req.body);
        console.log("Here, Before Token");
        // const {error} = validate(req.body);
        // console.log("Yo", error);
        // if(error){
        //     console.log("In error");
        //     return res.status(400).send({message: error.details[0].message});
        // }
        const student = await UserModel.findOne({userID: req.body.userID});
        // console.log(student.generateAuthToken());
        console.log("Here, After student");
        if(!student){
            console.log("Student not found");
            return res.status(401).send({message: "Invalid Details"});
        }
        const validPassword = await bcrypt.compare(
            req.body.password, student.password
        );
        
        if(!validPassword) {
            console.log("Invalid Password");
            return res.status(401).send({message: "Invalid Details"});
        }

        const token = student.generateAuthToken();
        console.log(token);
        console.log("Here, After Token");
        return res.status(200).send({data: token, message: "Logged In!!"});
    } catch(error) {
        return res.status(500).send({message: "Server Error!!"});
    }
})

// const validate = (data) => {
//     const schema = Joi.object({
//         rollno: Joi.string().required().label("rollno"),
//         password: passwordComplexity().required().label("password"),
//         role: Joi.string().required().label("role")
//     });
//     return schema.validate(data);
// }

module.exports = router;