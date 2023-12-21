const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
    review: {
        type: String,
        required: true
    },
    ratings: {
        type: Number,
        min: 1,
        max: 5,
        required: [true, 'ratings need to be required']
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'userModel',
        required: [true, 'review belongs to a user']
    },
    course: {
        type: mongoose.Schema.ObjectId,
        ref: 'courseModel',
        required: [true, 'review must belongs to a Course']
    }
})

reviewSchema.pre(/^find/, function (next) {
    this.populate({
        path: "user",
        select: "name profileImage"
    }).populate("course");
    next();
})
const reviewModel = mongoose.model("reviewModel", reviewSchema)

module.exports = reviewModel;