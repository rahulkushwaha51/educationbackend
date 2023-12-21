require('dotenv').config;
const jwt = require('jsonwebtoken')
const catchAsyncError = require('./catchAsyncError');
const ErrorHandler = require('../utility/errorHandler');
const userModel = require('../models/userModel');

const isAuthenticated = catchAsyncError(async function isAuthenticated(req, res, next) {
    const { token } = req.cookies;

    if (!token) return next(new ErrorHandler("Not Logged In", 401))
    const decoded = jwt.verify(token, process.env.JWT_KEY);
    req.user = await userModel.findById(decoded._id);
    next();
})



module.exports = isAuthenticated;

