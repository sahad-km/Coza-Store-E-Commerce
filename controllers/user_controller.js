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
            console.log(req.body);
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
        console.log('here now...');
        res.render('login',{title:'login',msg:'Account created, Please login',errmsg:''});
    }
}

const loginLoad = (req,res)=>{
    res.render('login',{title:'Login',msg:'',errmsg:''});
}
const loginCheck = async (req,res)=> {
    const { email, password } = req.body;
    console.log(req.body);
    const user = await User.findOne({ email });
    if (user) {
        const validPassword = await bcrypt.compare(password, user.password);
        if (validPassword) {
            req.session.userType = 'user';
            req.session.userId = user._id;
            console.log("logged in");
            res.redirect('/pages/home');
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
    const userDetails = await User.findById(userId);
    res.render('profile',{userDetails})
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
    const addressId = req.params.id
    const userId = req.session.userId;
    await User.updateOne({_id:userId},{$pull:{address:{"_id":addressId}}});
    req.flash('success','Address removed Successfully');
    res.redirect('/users/viewprofile')
}

const orderHistory = async(req,res)=>{
    const userId = req.session.userId;
    const brands = await Brand.find({});
    const orderHistory = await Checkout.find({userId})
    console.log(orderHistory)
    const cartCount = await Cart.aggregate([{$match:{userId}},{$project:{count:{$size:"$cartItems"}}}]);
    const wishlistCount = await Wishlist.aggregate([{$match:{userId}},{$project:{count:{$size:"$wishlistItems"}}}]);
    res.render('order_history',{cartCount,wishlistCount,brands,orderHistory})
}

const sessionCheck = (req,res,next) => {
    if(req.session.userId) {
        if(req.session.userType == 'user') {
            res.redirect('/pages/home');
        }else {
            res.redirect('/admin/dashboard');
        }
    }else {
        next();
    }
}
const logout = (req,res)=> {
    req.session.destroy();
    res.redirect('/');
}



module.exports = {registerLoad,insertDetails,loginLoad,loginCheck,loadProfile,addingAddress,removeAddress,orderHistory,sessionCheck,logout};