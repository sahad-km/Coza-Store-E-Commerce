const express = require('express');
const adminController = require("../controllers/admin_controller");
const router = express.Router();
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });

router.get('/signin', adminController.sessionCheck, adminController.signinPage);
router.post('/signin', adminController.signin);
router.get('/dashboard', adminController.sessionCheckDashboard, adminController.adminDashbord);
router.get('/logout', adminController.logout);
router.get('/viewusers',adminController.userDetailsLoad);
router.get('/userEdit/:id',adminController.sessionCheck,adminController.userLoad);
router.put('/update/:id',adminController.userUpdate);
router.delete('/userDelete/:id',adminController.userDelete);
router.delete('/brandDelete/:id',adminController.brandDelete);
router.get('/viewbrands',adminController.brandDetailsLoad);
router.get('/viewproducts',adminController.productDetailsLoad);
router.get('/addbrands',adminController.addBrandView);
router.get('/addproducts',adminController.addProductView);
router.post(('/insertproduct'), upload.array('image'), adminController.insertProduct);
router.post('/addbrands',adminController.addBrand);

module.exports = router;