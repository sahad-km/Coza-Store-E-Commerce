const mongoose = require('mongoose')
const Cart = require('../models/cartSchema');
const Brand = require('../models/brandSchema');
const Wishlist = require('../models/wishlistSchema');

const addToCartView = async (req, res) => {
    try{
    const proId = req.params.id;
    let variant = req.body.variant;
    let productId = new mongoose.Types.ObjectId(proId);
    let userId = req.session.userId;
    const cart = await Cart.findOne({userId: userId });
    if (cart) {
        //cart exists for user
        let productExist = await Cart.findOne({ $and: [{ userId }, { cartItems: { $elemMatch: { productId , variant } } }] });
        if (productExist) {
            //product exists in the cart, update the quantity
            await Cart.findOneAndUpdate({ $and: [{ userId },{ "cartItems.productId": productId },{ "cartItems.variant": variant }]},{ $inc: { "cartItems.$.quantity": 1 } });
            req.flash('success','Item added Successfully');
            res.redirect('/users/viewcart');
        } else {
            //product does not exists in cart, add new item
            await Cart.updateOne({ userId }, { $push: { cartItems: { productId, quantity: 1, variant } } });
            req.flash('success','Item added Successfully');
            res.redirect('/users/viewcart');
        }
    } else {
        //no cart for user, create new cart
        const cart = new Cart({
            userId,
            cartItems: [{ productId, quantity: 1 , variant}]
        });
        req.flash('success','Item added Successfully');
        try {
            await cart.save();
            res.redirect('/users/viewcart');
        } 
        catch (err) {
            const msg = 'Cart adding failed';
            req.flash('error','Item adding failed');
            res.send({ msg });
        }
    }
}catch(err){
    res.render('404NotFound');
}
}

const displayCart = async (req, res) => {
    let user = req.session.userId;
    let userId = new mongoose.Types.ObjectId(user);
    const brands = await Brand.find({});
    const cartCount = await Cart.aggregate([{$match:{userId}},{$project:{count:{$size:"$cartItems"}}}]);
    const wishlistCount = await Wishlist.aggregate([{$match:{userId}},{$project:{count:{$size:"$wishlistItems"}}}]);
    const viewCart = await Cart.aggregate([{ $match: { userId } },
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
    res.render('view_cart',{viewCart,brands,cartCount,wishlistCount})
}

const changeProductQt = async (req,res) =>{
    const cart = new mongoose.Types.ObjectId(req.body.cart);
    const product = new mongoose.Types.ObjectId(req.body.product);
    const variant = req.body.variant;
    const count = parseInt(req.body.count);
    await Cart.findOneAndUpdate({ $and: [{_id:cart }, { "cartItems.productId": product }, {"cartItems.variant": variant}] },{ $inc: { "cartItems.$.quantity": count }});
}

const cartItemDelete = async (req,res) =>{
    const productId = new mongoose.Types.ObjectId(req.body.product);
    const variant = req.body.variant;
    let userId= (req.session.userId);
    await Cart.updateOne({userId},{$pull:{cartItems:{"productId":productId,"variant":variant}}});
}

module.exports = { addToCartView, displayCart, changeProductQt, cartItemDelete};