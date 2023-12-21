require('dotenv').config;

const Razorpay = require('razorpay')

module.exports.instance = new Razorpay({
    key_id: process.env.RAZ_KEY,
    key_secret: process.env.RAZ_SECRET
});