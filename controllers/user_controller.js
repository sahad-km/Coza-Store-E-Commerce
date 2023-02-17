const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const User = require('../models/userSchema');
const Cart = require('../models/cartSchema');
const Wishlist = require('../models/wishlistSchema');
const Brand = require('../models/brandSchema');
const Checkout = require('../models/checkoutSchema');

const registerLoad = (req,res)=> {
    res.render('register',{title:'Create Account',msg:''});
}
const insertDetails = async (req,res) => {
    const exist_user = await User.findOne({email:req.body.email});
        if(exist_user) {
            res.render('register',{title:'Create Account',msg:'User already exist'});
        }else {
            const {name,email,mobNumber,password,userType} = req.body;
            const hashedPassword = await bcrypt.hash(password,10);
        const user = new User({
            name,
            email,
            mobNumber,
            password:hashedPassword,
            userType
        });
        await user.save();
        res.render('login',{title:'login',msg:'Account created, Please login',errmsg:''});
    }
}

const loginLoad = (req,res)=>{
    if (req.session.userId) {
        res.redirect('/')
    }else {
    res.render('login',{title:'Login',msg:'',errmsg:''});
    }
}
const loginCheck = async (req,res)=> {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user) {
        const validPassword = await bcrypt.compare(password, user.password);
        if (validPassword) {
            req.session.userType = 'user';
            req.session.userId = user._id;
            if(user.blockStatus){
                req.flash('error','You are blocked by the Admin');
                res.redirect('/users/login');
            }else{
            res.redirect('/');
            }
        }
        else {
            req.flash('error', 'invalid email or password');
            res.redirect('/users/login');

        }
    }
    else {
        req.flash('error', 'invalid email or password');
        res.redirect('/users/login');
    }
}
const loadProfile = async (req,res) =>{
    let userId= (req.session.userId);
    const brands = await Brand.find({});
    const cartCount = await Cart.aggregate([{$match:{userId}},{$project:{count:{$size:"$cartItems"}}}]);
    const wishlistCount = await Wishlist.aggregate([{$match:{userId}},{$project:{count:{$size:"$wishlistItems"}}}]);
    const userDetails = await User.findById(userId);
    res.render('profile',{userDetails,brands,cartCount,wishlistCount});
}

const addingAddress = async (req,res)=>{
    let userId= (req.session.userId);
    let newAddress = { fullName:req.body.fullName,email:req.body.email, mobNumber:req.body.mobNumber, houseName:req.body.houseName, city:req.body.city, state:req.body.state, pincode:req.body.pincode, country:req.body.country };
        await User.updateOne(
            { _id: userId }, 
            { $push: { address: newAddress } },
        );
        res.redirect('/users/viewprofile')
}

const removeAddress = async(req,res)=>{
    try{
    const addressId = req.params.id
    const userId = req.session.userId;
    await User.updateOne({_id:userId},{$pull:{address:{"_id":addressId}}});
    req.flash('success','Address removed Successfully');
    res.redirect('/users/viewprofile');
    }catch(err){
        res.render('404NotFound');
    }
}

const orderHistory = async(req,res)=>{
    const userId = req.session.userId;
    const brands = await Brand.find({});
    const orderHistory = await Checkout.find({userId:userId}).sort({createdAt: -1})
    const cartCount = await Cart.aggregate([{$match:{userId}},{$project:{count:{$size:"$cartItems"}}}]);
    const wishlistCount = await Wishlist.aggregate([{$match:{userId}},{$project:{count:{$size:"$wishlistItems"}}}]);
    let productDetails = await Checkout.aggregate([{ $match: {userId:userId } },
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
        },
    ])
    res.render('order_history',{cartCount,wishlistCount,brands,orderHistory,productDetails})
}

const changeStatus = async (req,res) =>{
    let orderId = new mongoose.Types.ObjectId(req.body.orderId);
    const id = await Checkout.findById({_id:orderId});
    let orderStatusId = id.orderStatus[0]._id;
    await Checkout.findOneAndUpdate({ $and: [{_id: orderId }, { "orderStatus._id": orderStatusId }] },{ $set: { "orderStatus.$.type": 'cancelled' }});
    res.redirect('/admin/vieworders')
}


const orderedProducts = async(req,res)=>{
    const userId = req.session.userId;
    let {id} =req.query;
    id = mongoose.Types.ObjectId(id)
    // const checkoutId = mongoose.Types.ObjectId(req.params.id.trim());
    const brands = await Brand.find({});
    const cartCount = await Cart.aggregate([{$match:{userId}},{$project:{count:{$size:"$cartItems"}}}]);
    const wishlistCount = await Wishlist.aggregate([{$match:{userId}},{$project:{count:{$size:"$wishlistItems"}}}]);
    try{
    let productDetails = await Checkout.aggregate([{ $match: {_id:id } },
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
        },
        
        
    ])
        res.render('ordered_product',{productDetails,brands,cartCount,wishlistCount})
    }
    catch(err){
        res.send(err);
    }
}


const logout = (req,res)=> {
    req.session.destroy();
    res.redirect('/');
}



module.exports = {registerLoad,insertDetails,loginLoad,loginCheck,loadProfile,addingAddress,removeAddress,orderHistory,
    changeStatus,orderedProducts,logout};