const express = require('express');
const StudentController = require('../controllers/studentController');
const {UserModel, validate} = require("../models/Student");
const {QueryModel} = require("../models/Query");
const {imageQueryModel} = require("../models/ImgQuery");
const {bookmarkModel} = require("../models/Bookmarks");
const {historyModel} = require("../models/History");
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
        textdata = await QueryModel.find({query: req.body.query, userID: req.body.userID});
        imgdata = await imageQueryModel.find({query: req.body.query, userID: req.body.userID});
        if(textdata.length == 0 || imgdata.length == 0) {
            RunPythonScript = function(){
                let options = {
                    // mode: 'text',
                    // pythonOptions: ['-u'], // get print results in real-time
                    // scriptPath: 'path/to/my/scripts', //If you are having python_test.py script in same folder, then it's optional.
                    args: [req.body.query] //An argument which can be accessed in the script using sys.argv[1]
                };
                // textdata = []
                // imgdata = []
                return new Promise((resolve,reject) =>{
                try {
                    PythonShell.run('/home/siddhant/Documents/Acads/SSD/SearchEngine/filter.py', options, function (err, result){
                        if (err) throw err;
                        textdata = JSON.parse(result)
                        textdata.forEach(element => {
                            element.userID = req.body.userID
                        });
                        console.log("Inside")
                        PythonShell.run('/home/siddhant/Documents/Acads/SSD/SearchEngine/filter_image.py', options, function (err, result){
                            if (err) throw err;
                            imgdata = JSON.parse(result)
                            imgdata.forEach(element => {
                                element.userID = req.body.userID
                            });
                            console.log(imgdata)
                            console.log(textdata)
                            QueryModel.insertMany(textdata);
                            imageQueryModel.insertMany(imgdata);
                            return res.status(200).send({textdata, imgdata});
                        });
                });
                resolve();
                } catch {
                    console.log('error running python code')
                    reject();
                    }
                })
            },

            await RunPythonScript();
        } else {
            console.log("Already Present");
            return res.status(200).send({textdata, imgdata});
        }
    } catch(error) {
        console.log(error);
        return res.status(500).send({message: "Server Error!!"});
    }
});


router.post("/addBookmark", async(req, res) => {
    try {
        console.log(req.body);
        await new bookmarkModel({...req.body}).save();
        console.log("Bookmark Added");
        res.status(201).send({message: "Bookmark added successfully"});
    } catch(err) {
        console.log(err);
        res.status(500).send({message: "Internal Server Error!"});
    }
});


router.post("/removeBookmark", async(req, res) => {
    try {
        console.log(req.body);
        const status = await bookmarkModel.deleteOne({...req.body});
        console.log("Bookmark Removed");
        if(status)
            res.status(201).send({message: "Bookmark removed successfully"});
    } catch(err) {
        console.log(err);
        res.status(500).send({message: "Internal Server Error!"});
    }
});

router.post("/addHistory", async(req, res) => {
    try {
        console.log(req.body);
        await historyModel.deleteOne({...req.body});
        await new historyModel({...req.body}).save();
        console.log("History Added");
        res.status(201).send({message: "History saved successfully"});
    } catch(err) {
        console.log(err);
        res.status(500).send({message: "Internal Server Error!"});
    }
});

router.post("/removeHistory", async(req, res) => {
    try {
        console.log(req.body);
        const status = await historyModel.deleteOne({...req.body});
        console.log("History Removed");
        if(status)
            res.status(201).send({message: "History removed successfully"});
    } catch(err) {
        console.log(err);
        res.status(500).send({message: "Internal Server Error!"});
    }
});


router.post("/addquery", async(req, res) => {
    try {
        console.log(req.body);
        console.log("Here, In add query");
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
        console.log("In get Queries");
        console.log(req.query);
        const queries = await QueryModel.find({userID : req.query.userID});
        const bookmarks = await bookmarkModel.find({userID : req.query.userID});
        const history = await historyModel.find({userID : req.query.userID});
        // console.log(queries);
        let sendData = [];
        if(queries.length == 0) return res.status(200).send({sendData});

        let data = new Set();
        // if(data.size > 0) {
            console.log(queries);
        console.log("After Set");
        let cnt = 0;
        while (cnt < 10) {
            let len = queries.length;
            let index = Math.floor(Math.random()*(len));
            data.add(queries[index]);
            cnt++;
        }
        data.forEach(key => sendData.push(key));
        console.log(sendData);
        console.log("--------");
            // return res.status(200).send({sendData, bookmarks, history});
        // }
        return res.status(200).send({sendData, bookmarks, history});
        // return res.status(200).send({sendData});
    } catch(error) {
        console.log(error);
        return res.status(500).send({message: "Server Error!!"});
    }
});

router.get("/getbookmarks", async(req, res) => {
    try{
        console.log("In get Queries");
        console.log(req.query);
        const bookmarks = await bookmarkModel.find({userID : req.query.userID});
        return res.status(200).send({bookmarks});
    } catch(error) {
        console.log(error);
        return res.status(500).send({message: "Server Error!!"});
    }
});

router.get("/gethistory", async(req, res) => {
    try{
        console.log("In get History");
        console.log(req.query);
        const userhistory = await historyModel.find({userID : req.query.userID});
        return res.status(200).send({userhistory});
    } catch(error) {
        console.log(error);
        return res.status(500).send({message: "Server Error!!"});
    }
});



module.exports = router;