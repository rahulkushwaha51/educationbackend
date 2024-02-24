const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema({
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "courseModel",
  },
  quantity: {
    type: Number,
    default: 1,
  },
  price: {
    type: Number,
    default: 0,
  },
  image: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
});

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
    type: [orderItemSchema],
  },
});
const cartSchema = new mongoose.Schema({
  price: {
    type: Number,
    default: 0,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "userModel",
  },
  items: {
    type: [orderItemSchema],
  },
});

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

const orderModel = mongoose.model("orderModel", orderSchema);
const cartModel = mongoose.model("cartModel", cartSchema);
const paymentorderModel = mongoose.model("paymentorderModel", paymentorderSchema);
module.exports = orderModel;
module.exports = cartModel;
module.exports = paymentorderModel;
