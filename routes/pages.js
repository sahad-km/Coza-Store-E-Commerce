const express = require('express');
const pageController = require("../controllers/page_controller");
const router = express.Router();

router.get('/',pageController.pageLoad);
router.get('/viewproduct/:id',pageController.viewProduct);
router.get('/allproducts',pageController.allProducts);

module.exports = router;