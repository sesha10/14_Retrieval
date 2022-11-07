const express = require('express');
const StudentController = require('../controllers/studentController');
const {UserModel, validate} = require("../models/Student");
const {QueryModel, validateQuery} = require("../models/Query");
const bcrypt = require('bcrypt');
const {PythonShell} = require('python-shell')
const { spawn } = require('child_process')
const router = express.Router();

// router.get('/student', StudentController.getAllDoc)

router.post("/signup", async(req, res) => {
    try {
        console.log(req.body);
        const { error } = validate(req.body);
        console.log("User signup", error);
        console.log(error);
        if(error)
            return res.status(400).send({message: error.details.details[0].message});
        const user = await UserModel.findOne({userID: req.body.userID});
        if(user)
            return res.status(409).send({message: "User with this UserID already exists!!"});

        const salt = await bcrypt.genSalt(Number(process.env.SALT));
        const hashPassword = await bcrypt.hash(req.body.password, salt);
        await new UserModel({...req.body, password: hashPassword}).save();
        res.status(201).send({message: "User created successfully"});
    } catch(err) {
        console.log(err);
        res.status(500).send({message: "Internal Server Error!"});
    }
});



router.post("/submitQuery", async(req, res) => {
    try {
        console.log(req.body);
        console.log("Here, In add query");

        let options = {
            // mode: 'text',
            // pythonOptions: ['-u'], // get print results in real-time
            // scriptPath: 'path/to/my/scripts', //If you are having python_test.py script in same folder, then it's optional.
            args: [req.body.query] //An argument which can be accessed in the script using sys.argv[1]
        };
        textdata = []
        imgdata = []
        PythonShell.run('/home/siddhant/Documents/Acads/SSD/SearchEngine/filter.py', options, function (err, result){
            if (err) throw err;
            // result is an array consisting of messages collected
            //during execution of script.
            // console.log('result: ', JSON.parse(result));
            textdata = JSON.parse(result)
            textdata.forEach(element => {
                element.userID = req.body.userID
            });
            // data.userID = req.body.userID
            console.log("Inside")
            PythonShell.run('/home/siddhant/Documents/Acads/SSD/SearchEngine/filter_image.py', options, function (err, result){
                if (err) throw err;
                // result is an array consisting of messages collected
                //during execution of script.
                // console.log('result: ', JSON.parse(result));
                imgdata = JSON.parse(result)
                imgdata.forEach(element => {
                    element.userID = req.body.userID
                });
                // data.userID = req.body.userID
                console.log(imgdata)
                return res.status(200).send({textdata, imgdata});
                // return res.status(200).send(data);
            });
            // return res.status(200).send(data);
        });


        // PythonShell.run('/home/siddhant/Documents/Acads/SSD/SearchEngine/filter_image.py', options, function (err, result){
        //     if (err) throw err;
        //     // result is an array consisting of messages collected
        //     //during execution of script.
        //     // console.log('result: ', JSON.parse(result));
        //     imgdata = JSON.parse(result)
        //     imgdata.forEach(element => {
        //         element.userID = req.body.userID
        //     });
        //     // data.userID = req.body.userID
        //     console.log(imgdata)
        //     // return res.status(200).send(data);
        // });
        // return res.status(200).send({textdata, imgdata});
        // const { error } = validateQuery(req.body);
        // if(error)
        //     return res.status(400).send({message: error.details.details[0].message});
        // const student = await UserModel.findOne({userID: req.body.userID});
        // // // console.log(student.generateAuthToken());
        // console.log("Student found", req.body);
        // if(!student){
        //     console.log("Student not found");
        //     return res.status(401).send({message: "Error submitting query!"});
        // }
        // console.log("Before Query submit");
        // await new QueryModel({...req.body}).save();
        // console.log("Query Submitted");
        // return res.status(200).send({message: "Query Submitted!!"});
    } catch(error) {
        console.log(error);
        return res.status(500).send({message: "Server Error!!"});
    }
});




router.post("/addquery", async(req, res) => {
    try {
        console.log(req.body);
        console.log("Here, In add query");
        // const { error } = validateQuery(req.body);
        // if(error)
        //     return res.status(400).send({message: error.details.details[0].message});
        const student = await UserModel.findOne({userID: req.body.userID});
        // // console.log(student.generateAuthToken());
        console.log("Student found", req.body);
        if(!student){
            console.log("Student not found");
            return res.status(401).send({message: "Error submitting query!"});
        }
        console.log("Before Query submit");
        await new QueryModel({...req.body}).save();
        console.log("Query Submitted");
        return res.status(200).send({message: "Query Submitted!!"});
    } catch(error) {
        console.log(error);
        return res.status(500).send({message: "Server Error!!"});
    }
});

router.get("/getqueries", async(req, res) => {
    try{
        console.log(req.query);
        const queries = await QueryModel.find({studentrollno : req.query.rollno});
        console.log(queries);
        return res.status(200).send(queries);
    } catch(error) {
        console.log(error);
        return res.status(500).send({message: "Server Error!!"});
    }
});

router.get("/getconcerns", async(req, res) => {
    try{
        console.log(req.query);
        const queries = await QueryModel.find({tarollno : req.query.rollno});
        return res.status(200).send(queries);
    } catch(error) {
        console.log(error);
        return res.status(500).send({message: "Server Error!!"});
    }
});

router.patch("/addtacomment", async(req, res) => {
    try{
        console.log(req.body);
        // const queries = await QueryModel.find({_id : req.body.id});
        // console.log(queries);
        let query = await QueryModel.findOneAndUpdate({"_id": req.body.id}, { "$set" :{"tacomment": req.body.comment.tacomment, "isactive": req.body.comment.isactive }});
        query = await QueryModel.findOne({_id: req.body.id});
        console.log("Here",query);
        return res.status(200).send(query);
    } catch(error) {
        console.log(error);
        return res.status(500).send({message: "Server Error!!"});
    }
});

module.exports = router;