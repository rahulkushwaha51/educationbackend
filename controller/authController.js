require('dotenv').config();
const userModel = require("../models/userModel");
const jwt = require("jsonwebtoken");
const JWT_KEY = process.env.JWT_KEY;
const ErrorHandler = require('../utility/errorHandler');
const { SendToken } = require('../utility/SendToken');
const catchAsyncError = require('../middlewares/catchAsyncError');
const sendEmail = require('../utility/sendEmail');
const crypto = require("crypto");
const uploadFile = require('../utility/Upload');
const cloudinary = require("cloudinary").v2


//user registration 

module.exports.register = catchAsyncError(async function register(req, res, next) {
    const { name, email, password } = req.body;
    const file = req.file;

    if (!name || !email || !password) {
        return next(new ErrorHandler("Please enter all fields", 400));
    }

    const user = await userModel.findOne({ email });

    if (user) {
        return next(new ErrorHandler("User already exists", 409));
    }

    // Upload file on Cloudinary
    const fileUri = await uploadFile(file);
    // Upload the file to Cloudinary
    const myCloud = await cloudinary.uploader.upload(fileUri.content);

    // Create and save the user
    const newUser = await userModel.create({
        name,
        email,
        password,
        confirmpassword,
        avatar: {
            public_id: myCloud.public_id,
            url: myCloud.secure_url,
        },
    });

    if (newUser) {
        return SendToken(res, newUser, "Registered Successfully", 201);
    } else {
        return res.json({
            message: "Error while signing up",
        });
    }
});


// Login 

module.exports.logIn = catchAsyncError(async function logIn(req, res, next) {
    const { email, password } = req.body;

    if (!email || !password) return next(new ErrorHandler("please enter all fiels", 400))

    const user = await userModel.findOne({ email }).select("+password");

    if (!user) return next(new ErrorHandler("Incorrect Email or Password", 401))
    //bcrypt -> compare

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return next(new ErrorHandler("Incorrect Email or Password", 401))

    SendToken(res, user, `Welcome back,${user.name}`, 200)
});

// Logout 

module.exports.logout = catchAsyncError(async function logout(req, res, next) {
    res.status(200).cookie('token', null, {
        expires: new Date(Date.now()),
        httpOnly: true,
        secure: true,
        sameSite: "none",
    })
        .json({
            success: true,
            message: "Logged out successfully"
        })
})
// isAuthorised--> to check the roles

// forget password

module.exports.forgetPassword = catchAsyncError(async function forgetPassword(req, res,next) {
    let { email } = req.body;
    let user = await userModel.findOne({ email });
    if (!user)
        return next(new ErrorHandler("User not found", 400))

    const resetToken = await user.getResetToken();

    await user.save();

    // send token via email

    const url = `${process.env.FRONTEND_URL}/resetpassword/${resetToken}`;
    const message = `Click on the link to reset your password .${url}. if you have not request then please ignore`

    await sendEmail(user.email, "Education Reset Password", message)

    res.status(200).json({
        success: true,
        message: `Reset Link has been sent to ${user.email}`,
        url
    })
})


// reset password 
module.exports.resetPassword = catchAsyncError(async function resetPassword(req, res, next) {

    const { token } = req.params;

    const resetPasswordToken =
        crypto
            .createHash("sha256")
            .update(token)
            .digest("hex");

    const user = await userModel.findOne({
        resetPasswordToken, resetPasswordExpire: {
            $gt: Date.now(),
        },

    });

    if (!user)
        return next(new ErrorHandler("token is invalid or Expired", 400))

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    res.status(200).json({
        success: true,
        message: "Password reset Successfully"
    })

})

// change password
module.exports.changePassword = catchAsyncError(async function changePassword(req, res, next) {
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword)
        return next(new ErrorHandler("please enter all fiels", 400))
    const user = await userModel.findById(req.user._id).select("+password");
    const isMatch = await user.comparePassword(oldPassword);
    if (!isMatch)
        return next(new ErrorHandler("Incorrect Old Password", 400))

    user.password = newPassword

    await user.save();

    res.status(200).json({
        success: true,
        message: "Password Changed successfully",
    });

})

