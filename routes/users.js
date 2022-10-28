const express = require('express');
const router = express.Router();
const userController = require('../controllers/user_controller');
const cartController = require('../controllers/cart_controller');
const otpController = require('../controllers/otp_controller');
const wishlistController = require('../controllers/wishlist_controller');
const checkoutController = require('../controllers/checkout_controller');
const paymentController = require('../controllers/payment_controller');

//--------------------------------------------------//
router.get('/login',userController.sessionCheck,userController.loginLoad);
router.post('/login_check',userController.loginCheck);
router.post('/logout',userController.logout);
//--------------------------------------------------//
router.get('/register',userController.registerLoad);
router.post('/newuser',userController.insertDetails);
//--------------------------------------------------//
router.post('/add-to-cart/:id',cartController.addToCartView);
// router.get('/add-to-cart/:id',cartController.addToCartView);
router.get('/viewcart',cartController.displayCart);
router.post('/change-product-qt',cartController.changeProductQt);
router.post('/cartItemDelete',cartController.cartItemDelete);
//--------------------------------------------------//
router.post('/add-to-wishlist/:id',wishlistController.addToWishlist);
router.get('/viewwishlist',wishlistController.displayWishlist);
router.post('/wishlistItemDelete',wishlistController.wishlistItemDelete);
//--------------------------------------------------//
// router.post('/otpsend',otpController.sendOTPVerificationEmail);
//--------------------------------------------------//
router.post('/checkoutview/:id',checkoutController.checkoutPage);
router.get('/order-success/:id',checkoutController.successPage)
router.get('/order-success/cod',checkoutController.successPageCod)
//--------------------------------------------------//
router.get('/viewprofile',userController.loadProfile);
router.post('/addToProfile',userController.addingAddress);
router.get('/delete/:id',userController.removeAddress)
//--------------------------------------------------//
// router.post('/create/orderId',paymentController.createOrderId);
router.post('/place-order',paymentController.placeOrder);
router.post('/verify-payment',paymentController.verifyPayment);
//--------------------------------------------------//
router.get('/orderhistory',userController.orderHistory);


module.exports = router;