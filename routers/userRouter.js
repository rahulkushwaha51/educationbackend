const express = require("express");
const userRouter = express.Router();
const { getAllUser, getMyProfile, updateProfile, updateProfilePicture, removefromPlayList, addtoPlayList, updateUserRole, deleteUser, deleteMyProfile } = require("../controller/userController")
const { register, logIn, logout, changePassword, forgetPassword, resetPassword, } = require("../controller/authController")
const isAuthenticated = require('../middlewares/auth');
const { authorizeAdmin } = require("../middlewares/authAdmin");
const singleUpload = require("../middlewares/Multer");
const { buySubscription, paymentVerification, getRazorpayKey, cancelSubscription } = require("../controller/paymentController");

// user's options 


// auth routes
userRouter
    .route('/register')
    .post(singleUpload, register)


// forget password route
userRouter
    .route('/forgetpassword')
    .post(forgetPassword)

userRouter
    .route('/resetpassword/:token')
    .patch(resetPassword)

// login and logout

userRouter
    .route('/login')
    .post(logIn)

userRouter
    .route('/logout')
    .get(isAuthenticated, logout)

// profile page for user

userRouter
    .route('/me')
    .get(isAuthenticated, getMyProfile);

userRouter
    .route("/updateprofile")
    .patch(isAuthenticated, updateProfile)

userRouter
    .route("/me")
    .delete(isAuthenticated, deleteMyProfile)

userRouter
    .route("/updatepicture")
    .patch(isAuthenticated, singleUpload, updateProfilePicture)


userRouter
    .route('/changepassword')
    .patch(isAuthenticated, changePassword)

// admin specific function
userRouter
    .route('/users')
    .get(isAuthenticated, authorizeAdmin, getAllUser)

userRouter
    .route('/admin/user/:id')
    .patch(isAuthenticated, authorizeAdmin, updateUserRole)
    .delete(isAuthenticated, authorizeAdmin, deleteUser)

userRouter.
    route("/addtoplaylist")
    .post(isAuthenticated, addtoPlayList)

userRouter
    .route("/removefromplaylist")
    .delete(isAuthenticated, removefromPlayList)

userRouter
    .route("/subscribe")
    .get(isAuthenticated, buySubscription)

userRouter
    .route('/paymentverification')
    .post(isAuthenticated, paymentVerification);

userRouter
    .route('/razorpaykey')
    .get(getRazorpayKey)

userRouter
    .route('/subscribe/cancel')
    .delete(isAuthenticated, cancelSubscription)

module.exports = userRouter;