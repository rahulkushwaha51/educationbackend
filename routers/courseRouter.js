const express = require('express');
const courseRouter = express.Router();
const { getCourse, createCourse, updateCourse, deleteCourse, getTop3Course, getAllCourses, getCourseLectures, addLecture, deleteLecture } = require('../controller/courseController');
const isAuthenticated = require('../middlewares/auth')
const singleUpload = require('../middlewares/Multer');
const { authorizeAdmin, } = require('../middlewares/authAdmin');
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
    .route('/course/:id')
    .get(getCourse)
    .delete(isAuthenticated, authorizeAdmin,singleUpload, deleteCourse)
// only admin can use this 

courseRouter
    .route('/createcourse')
    .post(isAuthenticated, authorizeAdmin, singleUpload, createCourse)


courseRouter
    .route("/updatecourse")
    .patch(isAuthenticated,authorizeAdmin,updateCourse);


// get Lectures
courseRouter
    .route('/lecture/:id')
    .get(isAuthenticated , getCourseLectures)
    .post(isAuthenticated, authorizeAdmin, singleUpload, addLecture)
   

courseRouter
    .route('/deletelecture')
    .delete(isAuthenticated, authorizeAdmin, singleUpload, deleteLecture)


module.exports = courseRouter;
