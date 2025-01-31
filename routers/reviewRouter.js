const express = require('express');
const { getAllReviews,top3Reviews, getCourseReviews, createReview, updateReviews, deleteReviews } = require('../controller/reviewController');
const isAuthenticated = require('../middlewares/auth');
const reviewRouter = express.Router();

reviewRouter
.route("/all")
.get(getAllReviews)

reviewRouter
.route("/top3")
.get(top3Reviews)
// review for particular course
reviewRouter
.route("/:id")
.get(getCourseReviews)

// crud operation
reviewRouter
.route('/createreview/:id')
.post(isAuthenticated,createReview)

reviewRouter
.route('/crud/:id')
.patch(updateReviews)
.delete(deleteReviews)

module.exports = reviewRouter;