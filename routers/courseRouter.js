const express = require('express');
const courseRouter = express.Router();
const { getCourse, createCourse, updateCourse, deleteCourse, getTop3Course, getAllCourses, getCourseLectures, addLecture, deleteLecture } = require('../controller/courseController');
const isAuthenticated = require('../middlewares/auth')
const singleUpload = require('../middlewares/Multer');
const { authorizeAdmin, authorizeSubscribers } = require('../middlewares/authAdmin');
// get all course

courseRouter
    .route('/courses')
    .get(getAllCourses)

// top3 courses
courseRouter
    .route('/top3')
    .get(getTop3Course)

// get own course -> login required
courseRouter
    .route('/:id')
    .get(isAuthenticated, getCourse)
// only admin can use this 

courseRouter
    .route('/createcourse')
    .post(isAuthenticated, authorizeAdmin, singleUpload, createCourse)


// courseRouter
//     .route("/deletecourse")


// get Lectures
courseRouter
    .route('/course/:id')
    .get(isAuthenticated, authorizeSubscribers, getCourseLectures)
    .post(isAuthenticated, authorizeAdmin, singleUpload, addLecture)
    .delete(isAuthenticated, authorizeAdmin, deleteCourse)

courseRouter
    .route('/lecture')
    .delete(isAuthenticated, authorizeAdmin, singleUpload, deleteLecture)


module.exports = courseRouter;
