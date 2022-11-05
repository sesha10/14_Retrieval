const StudentModel = require('../models/Student');

class StudentController {
    static getAllDoc = async(req, res) => {
        try {
            const result = await StudentModel.find();
            res.send(result);
        } catch (err) {
            console.error(err);
        }
    }
}

module.exports = StudentController;