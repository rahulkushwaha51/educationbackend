const express = require('express');
const orderRouter = express.Router();
const { addtoCart, placeOrder, removeFromCart, getCart, clearCart } = require('../controller/orderController');
const isAuthenticated = require('../middlewares/auth');
const { checkout } = require('../controller/paymentController');


orderRouter
    .route('/cart')
    .get(isAuthenticated, getCart)

orderRouter
    .route('/addtocart')
    .post(isAuthenticated, addtoCart)


orderRouter
    .route('/removefromcart')
    .post(isAuthenticated, removeFromCart)

orderRouter
    .route('/clearcart')
    .post(isAuthenticated, clearCart)

orderRouter.route('/order')
    .post(isAuthenticated, placeOrder)

orderRouter
    .route('/checkout')
    .post(isAuthenticated, checkout)
module.exports = orderRouter;