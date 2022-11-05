const express = require('express');
const router = express.Router();
const userController = require('../controllers/user_controller');
const cartController = require('../controllers/cart_controller');
const otpController = require('../controllers/otp_controller');
const wishlistController = require('../controllers/wishlist_controller');
const checkoutController = require('../controllers/checkout_controller');
const paymentController = require('../controllers/payment_controller');
const couponController = require('../controllers/coupon_controller');
const session = require('../middlewares/middleware');

//--------------------------------------------------//
router.get('/login',userController.loginLoad);
router.post('/login_check',session.loginSession,userController.loginCheck);
router.get('/logout',session.sessionCheck,userController.logout);
//--------------------------------------------------//
router.get('/register',userController.registerLoad);
router.post('/newuser',userController.insertDetails);
//--------------------------------------------------//
router.post('/add-to-cart/:id',session.sessionCheck,cartController.addToCartView);
// router.get('/add-to-cart/:id',cartController.addToCartView);
router.get('/viewcart',session.sessionCheck,cartController.displayCart);
router.post('/change-product-qt',session.sessionCheck,cartController.changeProductQt);
router.post('/cartItemDelete',session.sessionCheck,cartController.cartItemDelete);
//--------------------------------------------------//
router.post('/add-to-wishlist/:id',session.sessionCheck,wishlistController.addToWishlist);
router.get('/viewwishlist',session.sessionCheck,wishlistController.displayWishlist);
router.post('/wishlistItemDelete',session.sessionCheck,wishlistController.wishlistItemDelete);
//--------------------------------------------------//
router.post('/otpsend',otpController.sendOTPVerificationEmail);
router.post('/verifyotp',otpController.otpVerify);
//--------------------------------------------------//
router.post('/checkoutview/:id',session.sessionCheck,checkoutController.checkoutPage);
router.get('/order-success/:id',session.sessionCheck,checkoutController.successPage)
// router.get('/order-success/cod/:id',checkoutController.successPageCod)
//--------------------------------------------------//
router.get('/viewprofile',session.sessionCheck,userController.loadProfile);
router.post('/addToProfile',session.sessionCheck,userController.addingAddress);
router.get('/delete/:id',session.sessionCheck,userController.removeAddress)
//--------------------------------------------------//
// router.post('/create/orderId',paymentController.createOrderId);
router.post('/place-order',session.sessionCheck,paymentController.placeOrder);
router.post('/verify-payment',session.sessionCheck,paymentController.verifyPayment);
//--------------------------------------------------//
router.get('/orderhistory',session.sessionCheck,userController.orderHistory);
router.post('/change-status',session.sessionCheck,userController.changeStatus);
router.get('/ordered-products',session.sessionCheck,userController.orderedProducts);
//---------------------------------------------------//
router.post('/applyCoupon',couponController.applyCoupon);


module.exports = router;