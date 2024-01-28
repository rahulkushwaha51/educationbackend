require("dotenv").config();
const catchAsyncError = require('../middlewares/catchAsyncError');
const courseModel = require('../models/courseModel');
const statsModel = require("../models/statsModel");
const uploadFile = require('../utility/Upload');
const ErrorHandler = require('../utility/errorHandler')
const cloudinary = require('cloudinary').v2



// getting all course avialable
module.exports.getAllCourses = catchAsyncError(async function getAllCourses(req, res, next) {

    const keyword = req.query.keyword || "";
    const category = req.query.category || "";
    const price = req.query.price || "";
    const ratingsAverage = req.query.ratings || "";
    let courses = await courseModel.find({
        title: {
            $regex: keyword,
            $options: "i",
        },
        category: {
            $regex: category,
            $options: "i",
        },
       price: {
            $regex: price,
            $options: 0,
        },
        ratingsAverage: {
            $regex: ratingsAverage,
            $options: [1,2,3,4,5],
        }
    }).select("-lectures");
    if (courses) {
        res.status(200).json({
            success: true,
            courses,
        });
    }
})
// getting top3 courses
module.exports.getTop3Course = catchAsyncError(async function getTop3Course(req, res, next) {
    let top3Course = await courseModel.find().sort({ "ratingsAverage": - 1 }).limit(3);
    res.status(200).json({
        message: " top3 course retrieved successfully",
        data: top3Course
    })
})
// getting own course only for user available
module.exports.getCourse = catchAsyncError(async function getCourse(req, res) {
    let id = req.params.id
    let course = await courseModel.findById(id);
    if (course) {
        res.json({
            message: "course is found",
            data: course
        })
    }
})
//  creating a course only for admin 
module.exports.createCourse = catchAsyncError(async function createCourse(req, res, next) {
    const {title,description,category,duration,price,level,CreatedBy} = req.body;
    const file = req.file;
    if (!title || !description || !category || !CreatedBy||!level||!duration||!price)
        return next(new ErrorHandler("Please add all fields", 400))
    if (!file || !file.originalname)
        return next(new ErrorHandler("File or originalname is missing", 400));
    const fileUri = await uploadFile(file);
    const myCloud = await cloudinary.uploader.upload(fileUri.content);
    await courseModel.create({
        title,
        description,
        category,
        CreatedBy,
        level,
        duration,
        price,
        poster: {
            public_id: myCloud.public_id,
            url: myCloud.secure_url
        }
    })
    res.status(201).json({
        success: true,
        message: "course created successfully You can add lectures noww",
    })
})
// creating course lectures
module.exports.getCourseLectures = catchAsyncError(async function getCourseLectures(req, res, next) {
    let course = await courseModel.findById(req.params.id)
    if (!course)
        return next(new ErrorHandler("Course not found", 404))
    course.views += 1;
    await course.save();
    res.status(200).json({
        success: true,
        lectures: course.lectures,
    })
})
// add lectures max size 100mb
module.exports.addLecture = catchAsyncError(async function addLecture(req, res, next) {
    const { id } = req.params;

    const { title, description } = req.body
    const file = req.file;
    if (!file) return next(new ErrorHandler("please enter all fields", 400))
    const course = await courseModel.findById(id)
    if (!course)
        return next(new ErrorHandler("Course not found", 404))
    // upload file here
    const fileUri = await uploadFile(file);
    const myCloud = await cloudinary.uploader.upload(fileUri.content, {
        resource_type: "video",
    });
    course.lectures.push({
        title,
        description,
        video: {
            public_id: myCloud.public_id,
            url: myCloud.secure_url
        },
    });
    course.numofVideos = course.lectures.length;
    await course.save();
    res.status(200).json({
        success: true,
        message: "Lecture added in Course",
    })
})
// deleting course only for admin
module.exports.deleteCourse = catchAsyncError(async function deleteCourse(req, res, next) {
    let id = req.params.id;
    const course = await courseModel.findById(id);
    if (!course) return next(new ErrorHandler("Course not found", 404));
    await cloudinary.uploader.destroy(course.poster.public_id);
    for (let i = 0; i < course.lectures.length; i++) {
        const singleLecture = course.lectures[i];
        await cloudinary.uploader.destroy(singleLecture.video.public_id,
            { resource_type: "video" }
        );
    }
    await courseModel.findByIdAndDelete(id);
    res.status(200).json({
        success: true,
        message: "Course deleted successfully",
    });
});
// updating course only for admin
module.exports.updateCourse = catchAsyncError(async function updateCourse(req, res) {
    const id = req.params.id;
    if (id) {
        const dataToBeUpdate = req.body;
        const course = await courseModel.findById(id);
        for (let key in dataToBeUpdate) {
            if (course[key] !== undefined) {
                course[key] = dataToBeUpdate[key];
            } else {
                return res.status(400).json({
                    message: `Invalid field: ${key}`
                })
            }
        }
        // Save the updated course
        const updatedCourse = await course.save();
        res.json({
            message: "Course updated successfully",
            data: updatedCourse
        });
    }
})
// delete lecture
module.exports.deleteLecture = catchAsyncError(async function deleteLecture(req, res, next) {
    const { courseId, lectureId } = req.query;
    const course = await courseModel.findById(courseId);
    if (!course) {
        return next(new ErrorHandler("Course not found", 404));
    }
    const lecture = course.lectures.find(function (item) {
        return item._id.toString() === lectureId.toString();
    });
    if (!lecture) {
        return next(new ErrorHandler("Lecture not found", 404));
    }
    await cloudinary.uploader.destroy(lecture.video.public_id, {
        resource_type: "video",
    });
    course.lectures = course.lectures.filter(function (item) {
        return item._id.toString() !== lectureId.toString();
    });
    course.numofVideos = course.lectures.length;
    await course.save();
    res.status(200).json({
        success: true,
        message: "Lecture deleted successfully",
    });
});
courseModel.watch().on("change", async function () {
    const stats = await statsModel.find({}).sort({ createdAt: "desc" }).limit(1);
    const courses = await courseModel.find({});
    let totalViews = 0
    for (let i = 0; i < courses.length; i++) {
        totalViews += courses[i].views;
    }
    stats[0].views = totalViews;
    stats[0].CreatedAt = new Date(Date.now());
    await stats[0].save();
})
