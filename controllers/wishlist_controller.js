const mongoose = require('mongoose');
const Wishlist = require('../models/wishlistSchema');
const Brand = require('../models/brandSchema');
const Cart = require('../models/cartSchema');


const addToWishlist = async (req,res) => {
    try{
    let variant = req.body.variant;
    const proId = req.params.id;
    let productId = new mongoose.Types.ObjectId(proId);
    let userId = req.session.userId;
    const wishlist_exist = await Wishlist.findOne({ userId });
    if (wishlist_exist) {
        //wishlist exists for user
        let productExist = await Wishlist.findOne({ $and: [{ userId }, { wishlistItems: { $elemMatch: { productId } } }] });
        if (productExist) {
            //product exists in the wishlist,
            req.flash('error','Product Already in your Wishlist');
            res.redirect('/users/viewwishlist');
        } else {
            //product does not exists in wishlist, add new product
            await Wishlist.updateOne({ userId }, { $push: { wishlistItems: { productId,variant } } });
            res.redirect('/users/viewwishlist');
        }
    } else {
        //no wishlist for user, create new wishlist
        const wishlist = new Wishlist({
            userId,
            wishlistItems: [{ productId, variant}]
        });
        try {
            await wishlist.save();
            res.redirect('/users/viewwishlist');
        } catch (err) {
            const msg = 'Wishlist adding failed';
            res.send({ msg });
        }
    }
}catch(err){
    res.render('404NotFound')
}
}

const displayWishlist = async (req, res) => {
    let user = req.session.userId;
    let userId = new mongoose.Types.ObjectId(user);
    const brands = await Brand.find({});
    const cartCount = await Cart.aggregate([{$match:{userId}},{$project:{count:{$size:"$cartItems"}}}]);
    const wishlistCount = await Wishlist.aggregate([{$match:{userId}},{$project:{count:{$size:"$wishlistItems"}}}]);
    const wishlist = await Wishlist.aggregate([{ $match: { userId } },
    { $unwind: '$wishlistItems' },
    {
        $project:
        {
            item: '$wishlistItems.productId',
            variant: '$wishlistItems.variant'
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
    res.render('wishlist',{wishlist,brands,cartCount,wishlistCount})
}
const wishlistItemDelete = async (req,res) =>{
    const productId = new mongoose.Types.ObjectId(req.body.product);
    const variant = req.body.variant;
    let userId= (req.session.userId);
    await Wishlist.updateOne({userId},{$pull:{wishlistItems:{"productId":productId,"variant":variant}}});
}


module.exports = { addToWishlist, displayWishlist,wishlistItemDelete};