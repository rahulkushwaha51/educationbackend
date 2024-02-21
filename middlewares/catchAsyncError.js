function catchAsyncError(passedFunction) {
    return function (req, res, next) {
        Promise.resolve(passedFunction(req, res, next)).catch(next);
    };
}
module.exports = catchAsyncError;
