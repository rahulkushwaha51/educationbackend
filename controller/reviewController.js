const catchAsyncError = require("../middlewares/catchAsyncError");
const CourseModel = require("../models/courseModel");
const reviewModel = require("../models/reviewModel")

module.exports.getAllReviews = catchAsyncError(async function getAllReviews(req, res) {

    const reviews = await reviewModel.find();
    if (reviews) {
        return res.json({
            message: "reviews is retrived",
            data: reviews
        })
    }
    else {
        return res.json({
            message: "reviews not found"
        })
    }

})

module.exports.top3Reviews = async function top3Reviews(req, res) {
    try {
        const reviews = await reviewModel.find().sort({ ratings: -1 }).limit(3);

        if (reviews && reviews.length > 0) {
            return res.json({
                message: "Top 3 reviews retrieved",
                data: reviews
            });
        } else {
            return res.status(404).json({
                message: "Reviews not found"
            });
        }
    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
}

module.exports.getCourseReviews = async function getCourseReviews(req, res) {
    try {
        let courseid = req.params.id;
        let courseReview = await reviewModel.find();
        courseReview = courseReview.filter(review => review.course.id === courseid);


        if (courseReview) {
            return res.json({
                message: "Course reviews retrieved",
                data: courseReview
            });
        } else {
            return res.status(404).json({
                message: "Reviews not found for this course"
            });
        }
    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
}

module.exports.createReviews = async function createReviews(req, res) {
    try {
        let id = req.params.Course;
        let Course = await CourseModel.findById(id);
        let review = await reviewModel.create(req.body);
        Course.ratingsAverage = (Course.ratingsAverage + req.body.ratings) / 2

        await Course.save();
        return res.json({
            message: "review created successfully",
            data: review
        })


    } catch (error) {
        return res.json({
            message: error.message
        })
    }
}
module.exports.updateReviews = async function updateReviews(req, res) {
    try {
        const id = req.params.id;
        const dataToBeUpdate = req.body;

        // Find the review by its ID
        const review = await reviewModel.findById(id);

        // Check if the review exists
        if (!review) {
            return res.status(404).json({
                message: "Review not found"
            });
        }

        // Update the review fields
        for (let key in dataToBeUpdate) {
            if (review[key] !== undefined) {
                review[key] = dataToBeUpdate[key];
            }
        }

        // Save the updated review
        const updatedReview = await review.save();

        return res.json({
            message: "Review updated successfully",
            data: updatedReview
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
}

module.exports.deleteReviews = async function deleteReviews(req, res) {
    try {
        let id = req.params.id;
        let review = await reviewModel.findByIdAndDelete(id);
        if (review) {

            return res.json({
                message: "review deleted successfully",
                data: review
            })
        }
        else {
            return res.json({ message: "review not found" })
        }
    } catch (error) {
        return res.json({
            message: error.message
        })
    }
}
