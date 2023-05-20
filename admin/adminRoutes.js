const express = require("express");
const router = express.Router();
const adminController = require('./adminController')

router.post('/register', adminController.register)
router.post('/login', adminController.login)
router.post('/addInstructor', adminController.addInstructor)
router.get('/getAllInstructors', adminController.getAllInstructors)
router.post('/addCourse', adminController.addCourse)
router.get('/getAllCourses', adminController.getAllCourses)
router.post('/addBatchToCourse', adminController.addBatchToCourse)
router.post('/ScheduleLecture', adminController.ScheduleLecture)
router.get('/getAllScheduledLecture', adminController.getAllScheduledLecture)

module.exports = router