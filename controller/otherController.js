require("dotenv").config;
const catchAsyncError = require("../middlewares/catchAsyncError");
const statsModel = require("../models/statsModel");
const ErrorHandler = require("../utility/errorHandler");
const sendEmail = require("../utility/sendEmail");

// contact us form
module.exports.contact = catchAsyncError(async function (req, res, next) {
    const { name, email, message } = req.body;
    if (!name || !email || !message)
        return next(new ErrorHandler("All field are mandatory", 400));
    const to = process.env.MY_MAIL;
    const subject = "Contact from Education";
    const text = `I am ${name}and my Email is ${email}.\n ${message}}`;
    await sendEmail(to, subject, text);
    res.status(200).json({
        success: true,
        message: "Your message has been sent",
    });
});
// course request form
module.exports.courseRequest = catchAsyncError(async function (req, res, next) {
    const { name, email, course } = req.body;
    const to = process.env.MY_MAIL;
    const subject = "Requesting for a course onEducation";
    const text = `I am ${name}and my Email is ${email}.\n ${course}}`;
    await sendEmail(to, subject, text);
    res.status(200).json({
        success: true,
        message: "Your request has been sent",
    });
});

// admin stats for selling
module.exports.getDeshboardstats = catchAsyncError(async function (req, res, next) {
    const stats = await statsModel.find({}).sort({
        createdAt:
            "desc"
    }).limit(12);
    const statsData = [];
    for (let i = 0; i < stats.length; i++) {
        statsData.unshift(stats[i]);
    }
    const requiredSize = 12 - stats.length;
    for (let i = 0; i < requiredSize; i++) {
        statsData.unshift({
            users: 0,
            subscription: 0,
            views: 0,
        });
    }
    const usersCount = statsData[11].users;
    const subscriptionCount = statsData[11].subscription;
    const viewsCount = statsData[11].views;

    let usersPercent = 0;
    let subscriptionPercent = 0;
    let viewsPercent = 0;

    let userProfit = true;
    let viewsProfit = true;
    let subscriptionProfit = true;

    if (statsData[10].users === 0)
        usersPercent = usersCount * 100;
    if (statsData[10].subscription === 0)
        subscriptionPercent = subscriptionCount * 100;
    if (statsData[10].views === 0)
        viewsPercent = viewsCount * 100;
    else {
        const difference = {
            users: statsData[11].users - statsData[10].users,
            views: statsData[11].views - statsData[10].views,
            subscription: statsData[11].subscription -
                statsData[10].subscription,
        };
        usersPercent = (difference.users / statsData[10].users)
            * 100;
        subscriptionPercent =
            (difference.subscription /
                statsData[10].subscription) * 100;
        viewsPercent = (difference.views / statsData[10].views)
            * 100;

        if (usersPercent < 0) userProfit = false;
        if (subscriptionPercent < 0) subscriptionProfit = false;
        if (viewsPercent < 0) viewsProfit = false;
    }

    res.status(200).json({
        success: true,
        stats: statsData,
        usersCount,
        subscriptionCount,
        viewsCount,
        usersPercent,
        subscriptionPercent,
        viewsPercent,
        userProfit,
        subscriptionProfit,
        viewsProfit,
    });
});
