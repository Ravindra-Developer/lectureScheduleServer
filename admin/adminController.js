require('../db/conn')
const admin = require('./adminSchema')
const Instructor = require('../models/instructorSchema')
const scheduledLecSchema = require('../models/scheduledLecSchema')
const course = require('../models/coursesSchema')
const Mail = require('../utility/mail')
const bcrypt = require('bcrypt')


let adminController = {}

adminController.register = async (req, res) => {
    const { email, password, confirmPassword } = req.body
    if (!email || !password || !confirmPassword) {
        return res.status(422).json({ error: "Please fill all the details." })
    }
    try {
        const userExist = await admin.findOne({ email: email })
        if (userExist) {
            return res.status(422).json({ error: "User Already Exist", success: false })
        } else if (password !== confirmPassword) {
            return res.status(422).json({ error: "Passwords Doesn't Match", success: false })
        } else {
            let admin_id, counter, num
            admin.findOne({}).sort({ counter: -1 }).then(count => {
                counter = count ? count.counter + 1 : 1;
                if (counter < 1000) {
                    num = String(counter).padStart(4, '0');
                } else {
                    num = counter
                }
                admin_id = 'admin' + num;
                const newAdmin = new admin({ admin_id, email, password, counter })
                newAdmin.save().then(data => {
                    return res.status(200).json({ msg: "Register successfully", success: true })
                }, err => {
                    return res.status(500).json({ error: err, success: false })
                })
            })
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Internal Server Error", errMessage: error, success: false })
    }
}

adminController.login = async (req, res) => {
    const { email, password } = req.body
    if (!email || !password) {
        return res.status(422).json({ error: "Please fill all the details." })
    }
    try {
        const adminExist = await admin.findOne({ email: email })
        if (adminExist) {
            const ispassvalid = await bcrypt.compare(password, adminExist.password)
            if (!ispassvalid) {
                res.status(400).json({ erroe: "Invalid credential", success: false })
            } else {
                res.status(200).json({ message: "LoggedIn successfully", admin_id: adminExist.admin_id, success: true })
            }
        } else {
            return res.status(500).json({ msg: "Invalid Credential", success: false })
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Internal Server Error", errMessage: error, success: false })
    }
}

adminController.addInstructor = async (req, res) => {
    const { email, InstructorName } = req.body
    if (!email || !InstructorName) {
        return res.status(422).json({ error: "Please fill all the details." })
    }
    try {
        const userExist = await Instructor.findOne({ email: email })
        if (userExist) {
            return res.status(422).json({ error: "User Already Exist", success: false })
        } else {
            let user_id, counter, num
            Instructor.findOne({}).sort({ counter: -1 }).then(count => {
                counter = count ? count.counter + 1 : 1;
                if (counter < 1000) {
                    num = String(counter).padStart(4, '0');
                } else {
                    num = counter
                }
                user_id = 'INST' + num;
                const newINST = new Instructor({ user_id, email, InstructorName, counter })
                newINST.save().then(data => {
                    return res.status(200).json({ msg: "Register successfully", success: true })
                }, err => {
                    return res.status(500).json({ error: err, success: false })
                })
            })
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Internal Server Error", errMessage: error, success: false })
    }

}

adminController.getAllInstructors = async (req, res) => {
    try {
        const AllInstructors = await Instructor.find({}).sort({ createdOn: -1 })
        return res.status(200).json({ data: AllInstructors, success: true })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Internal Server Error", errMessage: error, success: false })
    }
}

adminController.addCourse = async (req, res) => {
    const { courseName, level, Description, Image } = req.body
    if (!courseName || !level || !Description || !Image) {
        return res.status(422).json({ error: "Please fill all the details." })
    }
    try {
        const courseExist = await course.findOne({ courseName: courseName, level: level })
        if (courseExist) {
            return res.status(422).json({ error: "Course Already Exist", success: false })
        } else {
            let course_id, counter, num
            course.findOne({}).sort({ counter: -1 }).then(count => {
                counter = count ? count.counter + 1 : 1;
                if (counter < 1000) {
                    num = String(counter).padStart(4, '0');
                } else {
                    num = counter
                }
                course_id = 'COURSE' + num;
                const newCourse = new course({ course_id, courseName, Description, level, Image, counter })
                newCourse.save().then(data => {
                    return res.status(200).json({ msg: "Course Added successfully", success: true })
                }, err => {
                    return res.status(500).json({ error: err, success: false })
                })
            })
        }

    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Internal Server Error", errMessage: error, success: false })
    }
}

adminController.getAllCourses = async (req, res) => {
    try {
        const courses = await course.find({}).sort({ createdOn: -1 })
        return res.status(200).json({ data: courses, success: true })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Internal Server Error", errMessage: error, success: false })
    }
}

adminController.addBatchToCourse = async (req, res) => {
    const { course_id, batchName } = req.body
    if (!course_id || !batchName) {
        return res.status(422).json({ error: "Please fill all the details." })
    }
    try {
        course.updateOne({ course_id: course_id }, { $addToSet: { batches: batchName } }).then(data => {
            return res.status(200).json({ msg: "Batch Added successfully", success: true })
        }, err => {
            return res.status(500).json({ error: err, success: false })
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Internal Server Error", errMessage: error, success: false })
    }
}

adminController.ScheduleLecture = async (req, res) => {
    const { admin_email, lectureDate, InstructorId, course_id, batch } = req.body
    console.log(req.body);
    if (!admin_email || !lectureDate || !InstructorId || !course_id) {
        return res.status(422).json({ error: "Please fill all the details." })
    }
    try {
        const lectureExist = await scheduledLecSchema.findOne({ lectureDate: lectureDate })
        if (lectureExist) {
            return res.status(500).json({ msg: "Instructor has been already assigned to a lecture on specific date", success: false })
        } else {
            let Teacher = await Instructor.findOne({ user_id: InstructorId })
            let courseData = await course.findOne({ course_id: course_id }, { courseName: 1 })
            const newLecture = new scheduledLecSchema();
            newLecture.lectureDate = lectureDate
            newLecture.user_id = InstructorId
            newLecture.course_id = course_id
            newLecture.courseName = courseData.courseName
            newLecture.InstructorName = Teacher.InstructorName
            newLecture.batch = batch
            let result = await newLecture.save()
            let mailContent = 'Lecture of ' + courseData.courseName + ' has been scheduled on ' + lectureDate + ' by Admin.'
            sendMail(Teacher.email, mailContent)
            mailContent = 'Lecture of ' + courseData.courseName + ' has been scheduled to ' + Teacher.InstructorName + ' on ' + lectureDate + '.'
            sendMail(admin_email, mailContent)

            if (result) {
                return res.status(200).json({ msg: "Lecture has been scheduled", success: true })
            } else {
                return res.status(500).json({ msg: "Failed to schedule lecture", success: true })
            }
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Internal Server Error", errMessage: error, success: false })
    }

    function sendMail(email, data) {
        subject = 'Lecture Schedule - Lecture-Scheduling-Module'
        Mail.sendMail(email, subject, data, (err, data) => {
            if (err) {
                return res.status(500).json({ msg: "Unable to send mail", error: err, success: false })
            }
        })
    }
}

adminController.getAllScheduledLecture = async (req, res) => {
    try {
        let data = await scheduledLecSchema.find({}).sort({ createdAt: -1 })
        return res.status(200).json({ data: data, success: true })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Internal Server Error", errMessage: error, success: false })
    }
}

module.exports = adminController