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



const cartModel = mongoose.model("cartModel", cartSchema);


module.exports = cartModel;

