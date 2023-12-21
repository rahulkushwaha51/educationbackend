const ErrorHandler = require("../utility/errorHandler");
const catchAsyncError = require("./catchAsyncError");

const authorizeAdmin = catchAsyncError(async function (req, res, next) {
    // Ensure req.user exists and has a role property

    if (!req.user || !req.user.role || req.user.role !== "admin") {
        return next(new ErrorHandler(`${req.user ? req.user.role : 'User'} is not allowed to access this resource`, 403));
    }

    next();
});
const authorizeSubscribers = catchAsyncError(async function (req, res, next) {
    // Ensure req.user exists and has a role property

    if (req.user.subscription.status !== "active" && req.user.role !== "admin")
        return next(new ErrorHandler("Only Subscribers can access this resourse", 403));
    next();
});

module.exports = {
    authorizeAdmin,
    authorizeSubscribers,
};