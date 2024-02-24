const mongoose = require("mongoose")
const paymentorderSchema = new mongoose.Schema({
    razorpay_order_id: {
        type: String,
        required: true,
    },
    razorpay_payment_id: {
        type: String,
        required: true,
    },
    razorpay_signature: {
        type: String,
        required: true,
    },
});
const paymentorderModel = mongoose.model("paymentorderModel", paymentorderSchema);
module.exports = paymentorderModel;