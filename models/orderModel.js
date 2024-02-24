const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    orderPrice: {
        type: Number,
        default: 0,
        required: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "userModel",
    },
    orderItems: {
        type: [],
    },
});
const orderModel = mongoose.model("orderModel", orderSchema);

module.exports = orderModel;