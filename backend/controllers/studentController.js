import Student from "../models/student.js";

export function createStudent(req, res) {
    const student = new Student(req.body)
    student.save().then(
        () => {
            res.json({
                message: "Student create"
            })
        }
    ).catch(
        () => {
            res.json({
                message: "Student not created"
            })
        }
    )
}

export function getStudents(req, res) {
    Student.find().then(
        (studentList) => {
            res.json({
                list: studentList
            })
        }
    ).catch(
        (error) => {
            res.json({
                message: error
            })
        }
    )
}

export function deleteStudent(req, res) {
    Student.deleteOne({name: req.body.name}).then(
        () => {
            res.json({
                message: "Student delete successfully"
            })
        }
    ).catch(
        (error) => {
            res.json({
                message: error
            })
        }
    )
}