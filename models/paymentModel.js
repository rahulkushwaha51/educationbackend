const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
    razorpay_signature: {
        type: String,
        required: true
    },
    razorpay_payment_id: {
        type: String,
        required: true
    },
    razorpay__subscription_id: {
        type: String,
        required: true
    },
    CreatedAt: {
        type: Date,
        default: Date.now,
    },

})

const paymentModel = mongoose.model('paymentModel', paymentSchema);

module.exports = paymentModel;