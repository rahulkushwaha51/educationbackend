const catchAsyncError = require("../middlewares/catchAsyncError");
const CourseModel = require("../models/courseModel");
const reviewModel = require("../models/reviewModel");
const ErrorHandler = require("../utility/errorHandler");

module.exports.getAllReviews = catchAsyncError(async function getAllReviews(req, res) {

    const reviews = await reviewModel.find();
    if (!reviews) {
        return next(new ErrorHandler("reviews not found", 404))
    }

    return res.status(200).json({
        message: "reviews is retrived",
        data: reviews
    })


})

module.exports.top3Reviews = catchAsyncError(async function top3Reviews(req, res) {

    const reviews = await reviewModel.find().sort({ ratings: -1 }).limit(3);

    if (!reviews && !reviews.length > 0) { return next(new ErrorHandler("reviews not found", 404)) }

    return res.status(200).json({
        success: true,
        message: "Top3 reviews",
        data: reviews
    });
})


module.exports.getCourseReviews = (async function getCourseReviews(req, res) {
    let courseid = req.params.id;
    let courseReview = await reviewModel.find();
    courseReview = courseReview.filter(review => review.course.id === courseid);


    if (!courseReview) {
        return next(new ErrorHandler("reviews not found", 404))
    } {
        return res.status(200).json({
            success: true,
            message: "Course reviews",
            data: courseReview
        });
    }

})

module.exports.createReview = catchAsyncError(async function createReviews(req, res, next) {

    let id = req.params.id;
    let Course = await CourseModel.findById(id);
    let review = await reviewModel.create(req.body);
    Course.ratingsAverage = (Course.ratingsAverage + req.body.ratings) / 2

    await Course.save();
    return res.status(200).json({
        success: true,
        message: "review created successfully",
        data: review
    })
})
module.exports.updateReviews = catchAsyncError(async function updateReviews(req, res, next) {

    const id = req.params.id;
    const dataToBeUpdate = req.body;

    // Find the review by its ID
    const review = await reviewModel.findById(id);
    // Check if the review exists
    if (!review) {
        return next(new ErrorHandler("Review not found", 404));
    }
    // Update the review fields
    for (let key in dataToBeUpdate) {
        if (review[key] !== undefined) {
            review[key] = dataToBeUpdate[key];
        }
    }
    // Save the updated review
    const updatedReview = await review.save();
    return res.status(200).json({
        success: true,
        message: "Review updated successfully",
        data: updatedReview
    });
})

module.exports.deleteReviews = catchAsyncError(async function deleteReviews(req, res, next) {

    let id = req.params.id;
    let review = await reviewModel.findByIdAndDelete(id);
    if (!review) {
        return next(new ErrorHandler("review not found", 404))
    }
    return res.status(200).json({
        success: true,
        message: "review deleted successfully",
        data: review
    })
})