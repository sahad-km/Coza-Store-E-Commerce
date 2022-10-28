const Product = require('../models/productSchema');
const Brand = require('../models/brandSchema');
const Cart = require('../models/cartSchema');
const Wishlist = require('../models/wishlistSchema');

const pageLoad = async(req,res)=> {
    let userId =req.session.userId;
    const productDisplay = await Product.find({}).limit(8);
    const latestArrivals = await Product.find({}).sort({createdAt: -1}).limit(6)
    const brands = await Brand.find({});
    const cartCount = await Cart.aggregate([{$match:{userId}},{$project:{count:{$size:"$cartItems"}}}]);
    const wishlistCount = await Wishlist.aggregate([{$match:{userId}},{$project:{count:{$size:"$wishlistItems"}}}]);
    res.render('index',{productDisplay,latestArrivals,brands,cartCount,wishlistCount});
}

const viewProduct = async(req,res)=>{
        const productId = req.params.id;
        const productDetails = await Product.findById(productId);
        const name = productDetails.product_name;
        const key = productDetails.product_brand;
        const relatedProducts = await Product.find({$and:[{ product_name: { $ne: name } },{product_brand:key}]});
        res.render('product_view', { productDetails,relatedProducts});
}
const allProducts = async(req,res)=>{
    const fullProducts = await Product.find({});
    res.render('all_products',{ fullProducts })
}

module.exports= {pageLoad,viewProduct,allProducts};