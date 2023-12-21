const express = require("express");
const {
  courseRequest,
  contact,
  getDeshboardstats,
} = require("../controller/otherController");
const isAuthenticated = require("../middlewares/auth");
const { authorizeAdmin } = require("../middlewares/authAdmin");

const otherRouter = express.Router();

// contact form
otherRouter.route("/contact").post(contact);

// request form
otherRouter.route("/request").post(courseRequest);

// get admin Dashboard stats

otherRouter
  .route("/admin/stats")
  .get(isAuthenticated, authorizeAdmin, getDeshboardstats);

module.exports = otherRouter;
