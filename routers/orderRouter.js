const express = require('express');
const orderRouter = express.Router();
const { addtoCart, placeOrder, removeFromCart, getCart, clearCart, paymentValidation, checkout } = require('../controller/orderController');
const isAuthenticated = require('../middlewares/auth');


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
    .get(isAuthenticated, placeOrder)

orderRouter
    .route('/checkout')
    .post(isAuthenticated, checkout)

orderRouter
    .route('/paymentvalidation')
    .post(isAuthenticated, paymentValidation)

module.exports = orderRouter;