const express = require('express');
const adminController = require("../controllers/admin_controller");
const router = express.Router();
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });
const session = require('../middlewares/middleware');
const CouponController = require('../controllers/coupon_controller');

//-------------------------------------------------------//
router.get('/signin',session.adminLoginSession,adminController.signinPage);
router.post('/signin', adminController.signin);
router.get('/dashboard',session.adminSession,adminController.adminDashbord);
router.get('/logout',session.adminSession,adminController.logout);
//--------------------------------------------------------//
router.get('/viewusers',session.adminSession,adminController.userDetailsLoad);
router.post('/userDelete',session.adminSession,adminController.userBlock);
//--------------------------------------------------------//
router.get('/editproduct/:id',session.adminSession,adminController.productLoad);
//--------------------------------------------------------//
router.put('/updateproduct/:id',session.adminSession,upload.array('image'),adminController.productUpdate);
router.post('/deleteproduct',session.adminSession,adminController.deleteProduct);
//--------------------------------------------------------//
router.get('/addbrands',session.adminSession,adminController.addBrandView);
router.post('/addbrands',session.adminSession,adminController.addBrand);
router.delete('/brandDelete/:id',session.adminSession,adminController.brandDelete);
router.get('/viewbrands',session.adminSession,adminController.brandDetailsLoad);
//--------------------------------------------------------//
router.get('/viewproducts',session.adminSession,adminController.productDetailsLoad);
router.get('/addproducts',session.adminSession,adminController.addProductView);
router.post(('/insertproduct'),session.adminSession,upload.array('image'), adminController.insertProduct);
//--------------------------------------------------------//
router.get('/viewbanner',session.adminSession,adminController.bannerDetailsLoad);
router.get('/addbanner',session.adminSession,adminController.addBannerView);
router.post(('/insertbanner'),session.adminSession,upload.array('image'), adminController.insertBanner);
router.post('/deletebanner',session.adminSession,adminController.bannerDelete);
//--------------------------------------------------------//
router.get('/vieworders',session.adminSession,adminController.orderDetailsLoad);
router.get('/ordered-products',session.adminSession,adminController.orderedProducts);
router.post('/change-status',session.adminSession,adminController.changeStatus);
//--------------------------------------------------------//
router.get('/viewcoupons',session.adminSession,CouponController.coupons);
router.get('/addcoupons',session.adminSession,CouponController.addCouponView);
router.get('/deleteCoupon/:id',session.adminSession,CouponController.deleteCoupon);
router.post('/insertcoupon',session.adminSession,CouponController.saveCoupon);
//----------------------------------------------------------//

module.exports = router;