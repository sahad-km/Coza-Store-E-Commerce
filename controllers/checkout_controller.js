const mongoose = require('mongoose')
const Cart = require('../models/cartSchema');
const Brand = require('../models/brandSchema');
const User = require('../models/userSchema');
const Checkout = require('../models/checkoutSchema');


const checkoutPage = async(req,res)=> {
    const brands = await Brand.find({});
    
    let userId = mongoose.Types.ObjectId(req.session.userId);
    const user = await User.findById(userId);
    const cartDetails = await Cart.aggregate([{ $match: { userId } },
        { $unwind: '$cartItems' },
        {
            $project:
            {
                item: '$cartItems.productId',
                itemQuantity: '$cartItems.quantity',
                variant: '$cartItems.variant'
            }
        },
        {
            $lookup:
            {
                from: process.env.PRODUCT_COLLECTION,
                localField: 'item',
                foreignField: '_id',
                as: 'product'
            }
        }])
    res.render('checkout_view',{brands,cartDetails,user})
}



const successPage = async(req,res)=>{
    try{
    const checkoutId = req.params.id
    const userId = req.session.userId;
    const userDetails = await User.findById(userId);
    const checkoutDetails = await Checkout.findById(checkoutId)
    res.render('order_success',{userDetails,checkoutDetails});
    }catch(err){
        res.render('404NotFound');
    }
}

// const successPageCod = async(req,res) => {

//     const userIdc= req.session.userId;
//     res.render('order_success');
// }


module.exports = {checkoutPage,successPage};