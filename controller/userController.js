const catchAsyncError = require("../middlewares/catchAsyncError");
const userModel = require("../models/userModel");
const courseModel = require("../models/courseModel");
const ErrorHandler = require("../utility/errorHandler");
const uploadFile = require("../utility/Upload");
const statsModel = require("../models/statsModel");
const cloudinary = require('cloudinary').v2;

// get profile
module.exports.getMyProfile = catchAsyncError(async function getMyProfile(req, res, next) {
    let user = await userModel.findById(req.user._id);
    res.status(200).json({
        success: true,
        user,
    });
})
// update profile
module.exports.updateProfile = catchAsyncError(async function updateProfile(req, res, next) {
    const { name, email } = req.body;
    const user = await userModel.findById(req.user._id);
    if (name) user.name = name;
    if (email) user.email = email;
    await user.save();
    res.status(200).json({
        success: true,
        message: "Profile updated  successfully",
    });
})

// update profile picture
module.exports.updateProfilePicture = catchAsyncError(async function updateProfilePicture(req, res, next) {
    const user = await userModel.findById(req.user._id);
    // upload file on cloudinary
    const file = req.file;
    if (!file)
        return next(new ErrorHandler("Please upload Picture", 400))
    const fileUri = await uploadFile(file)
    const myCloud = await cloudinary.uploader.upload(fileUri.content);
    await cloudinary.uploader.destroy(user.avatar.public_id);
    user.avatar = {
        public_id: myCloud.public_id,
        url: myCloud.url,
    }
    user.save();
    res.status(200).json({
        success: true,
        message: "Profile Picture updated  successfully",
    });
})

// delete personal profile
module.exports.deleteMyProfile = catchAsyncError(async function deleteMyProfile(req, res, next) {
    const user = await userModel.findById(req.user._id);
    await cloudinary.uploader.destroy(user.avatar.public_id);
    // cancel subcription
    await userModel.findByIdAndDelete(req.user._id);
    res.status(200).cookie("token", null, {
        expires: new Date(Date.now()),
    })
        .json({
            success: true,
            message: "User Deleted successfully",
        });
})
// delete user
module.exports.deleteUser = catchAsyncError(async function deleteUser(req, res, next) {
    const id = req.params.id;
    const user = await userModel.findById(id)
    if (!user)
        return next(new ErrorHandler("user not exist", 404))
    await cloudinary.uploader.destroy(user.avatar.public_id);
    // cancel subscription
    await userModel.findByIdAndDelete(id)
    res.status(200).json({
        message: "user has been deleted succesfully",
        data: user
    });
})
//  get all user for admin only task

module.exports.getAllUser = catchAsyncError(async function getAllUser(req, res, next) {
    let users = await userModel.find();
    if (!users)
        return next(new ErrorHandler("user not found", 404))

    res.status(200).json({
        success: true,
        users: users,
    })
})
module.exports.updateUserRole = catchAsyncError(async function updateUserRole(req, res, next) {
    let user = await userModel.findById(req.params.id);

    if (!user)
        return next(new ErrorHandler("user not found", 404))

    if (user.role === "user") user.role = "admin";
    else user.role = "user";

    await user.save()
    res.status(200).json({
        success: true,
        message: "User role updated successfully"
    })
})
// adding videos into playlist

module.exports.addtoPlayList = catchAsyncError(async function addtoPlayList(req, res, next) {
    const user = await userModel.findById(req.user._id);
    const course = await courseModel.findById(req.body.id)
    if (!course)
        return next(new ErrorHandler("Invalid Course Id", 404));
    const itemExist = user.playlist.find(function (item) {
        return item.course.toString() === course._id.toString();
    });
    if (itemExist)
        return next(new ErrorHandler("Item Already Exist", 409))
    user.playlist.push({
        course: course._id,
        poster: course.poster.url,
    });
    await user.save();
    res.status(200).json({
        success: true,
        message: "Added to Playlist successfully",
    })
})
// removing videos from playlist
module.exports.removefromPlayList = catchAsyncError(async function removefromPlayList(req, res, next) {
    const user = await userModel.findById(req.user._id);
    const course = await courseModel.findById(req.query.id)
    if (!course)
        return next(new ErrorHandler("Invalid Course Id", 404));
    const newPlaylist = user.playlist.filter(function (item) {
        if (item.course.toString() !== course._id.toString())
            return item;
    });
    user.playlist = newPlaylist;
    await user.save();
    res.status(200).json({
        success: true,
        message: "Removed from  Playlist successfully",
    })
})

userModel.watch().on("change", async function () {
    const stats = await statsModel.find({}).sort({ createdAt: "desc" }).limit(1);
    const subscription = await userModel.find({ "subscription.status": "active" });
    stats[0].users = await userModel.countDocuments();
    stats[0].subscription = subscription.length;
    stats[0].CreatedAt = new Date(Date.now());
    await stats[0].save();
})
