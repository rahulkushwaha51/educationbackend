const express = require('express');
const { protectRoute } = require('../controller/authController');
const { getAllReviews,top3Reviews, getCourseReviews, createReviews, updateReviews, deleteReviews } = require('../controller/reviewController');
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
reviewRouter.use(protectRoute)
reviewRouter
.route('/crud/:Course')
.post(createReviews)

reviewRouter
.route('/crud/:id')
.patch(updateReviews)
.delete(deleteReviews)

module.exports = reviewRouter;