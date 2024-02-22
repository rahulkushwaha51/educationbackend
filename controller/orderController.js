const catchAsyncError = require("../middlewares/catchAsyncError");
const courseModel = require("../models/courseModel");
const cartModel = require("../models/orderModel");

const OrderModel = require('../models/orderModel');
const userModel = require("../models/userModel");
const ErrorHandler = require("../utility/errorHandler");
module.exports.addtoCart = catchAsyncError(async function addtoCart(req, res, next) {
    const { courseId } = req.body;
    const userId = req.user._id;
    let cart = await cartModel.findOne({ userId });

    if (!cart) {
        cart = await cartModel.create({ userId, items: [] });
    }

    const existingCourse = cart.items.find(item => {
        return item.courseId.toString() === courseId.toString();
    })
    if (existingCourse) {
        existingCourse.quantity++;
    } else {
        const course = await courseModel.findById(courseId);
        if (!course) {
            return next(new ErrorHandler("Course not found", 404));
        }
        cart.items.push({ courseId, price: course.price });
    }

    cart.price = cart.items.reduce((total, item) => {
        total += item.price * item.quantity;
        return total;
    }, 0);

    await cart.save();

    res.status(201).json({ success: true, message: 'Course added to cart successfully', cart });
}
)

module.exports.getCart = catchAsyncError(async function getCart(req, res, next) {

    const userId = req.user._id;
    const cart = await cartModel.findOne({ userId });

    // If the cart doesn't exist or is empty, return an error
    if (!cart || cart.items.length === 0) {
        return res.status(404).json({ success: false, message: "Cart is empty",cart });
    }
    res.status(200).json({ success: true, message: "cart fetched sucessfully", cart });
});


module.exports.removeFromCart = catchAsyncError(async function removeFromCart(req, res, next) {
    const { courseId } = req.body;
    const userId = req.user._id;

    // Find the user's cart
    let cart = await cartModel.findOne({ userId });

    // If the cart doesn't exist or is empty, return an error
    if (!cart || cart.items.length === 0) {
        return next(new ErrorHandler("Cart is empty", 400));
    }

    // Find the item in the cart
    const item = cart.items.find(item => item.courseId.toString() === courseId.toString());

    // If the item is not found in the cart, return an error
    if (!item) {
        return next(new ErrorHandler("Course not found in cart", 404));
    }

    // Decrease the quantity of the item
    if (item.quantity > 1) {
        item.quantity--; // Decrease quantity if it's greater than 1
    } else {
        // If the quantity is 1, remove the item from the cart
        const index = cart.items.indexOf(item);
        cart.items.splice(index, 1);
    }

    // Recalculate the total price of the cart
    cart.price = cart.items.reduce((total, item) => {
        total += item.price * item.quantity;
        return total;
    }, 0);

    // Save the updated cart to the database
    await cart.save();
    if (cart.items.length === 0) {
        await cartModel.deleteOne({ userId });
    }

    if (cart.items.length > 0) {
        res.status(200).json({ success: true, message: 'Quantity updated in cart successfully', cart });
    }
    else {
        res.status(200).json({ success: true, message: 'Course Removed From cart successfully', cart });
    }
});


module.exports.placeOrder = catchAsyncError(async function placeOrder(req, res, next) {
    const { userId } = req.body;

    // Find the cart associated with the user
    let cart = await cartModel.findOne({ userId });

    // If the cart doesn't exist or is empty, return an error
    if (!cart || cart.items.length === 0) {
        return next(new ErrorHandler("Cart is empty", 400));
    }

    // Create a new order object based on the cart contents
    const order = new OrderModel({
        userId,
        items: cart.items,
        orderPrice: cart.price
    });

    await order.save();

    // Clear the user's cart after placing the order
    cart.items = [];
    cart.totalPrice = 0;
    await cart.save();

    // Respond with success message and the created order
    res.status(201).json({ success: true, message: 'Order placed successfully', order });
});
