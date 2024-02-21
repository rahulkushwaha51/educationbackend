const express = require('express');
const orderRouter = express.Router();
const { addtoCart, placeOrder, removeFromCart, getCart } = require('../controller/orderController');
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

orderRouter.route('/order')
    .post(isAuthenticated, placeOrder)
module.exports = orderRouter;