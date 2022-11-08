const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const Admin = require('../models/adminSchema');
const Brand = require('../models/brandSchema');
const User = require('../models/userSchema');
const Product = require('../models/productSchema');
const Banner = require('../models/bannerSchema');
const Checkout = require('../models/checkoutSchema');

//Rendering login page to the admin

const signinPage = (req, res) => {
    res.render('admin_login', { message: req.flash('invalid') })
}

//Inserting new products to the stock

const insertProduct = async (req, res) => {
    const exist_product = await Product.findOne({ product_name: req.body.product_name });
    if (exist_product) {
        res.render('admin_product', { msg: 'Product already exist' });
    } else {
        const {product_name,product_brand,product_description,stock1,stock2,stock3,stock4,stock5,selling_price,org_price} = req.body;
        const product = new Product({
            product_name,
            product_brand,
            product_description,
            product_stock: [{
        
                stock1: stock1,
                stock2: stock2,
                stock3: stock3,
                stock4: stock4,
                stock5: stock5
                }
            ], 
            selling_price,
            org_price,
            image:req.files.map(f => ({ url: f.path, filename: f.filename }))
        });
        await product.save();
        res.redirect('/admin/viewproducts');
    }
}

//Inserting banners to the website

const insertBanner = async (req, res) => {
        const {highlight,description,product_link} = req.body;
        const banner = new Banner({
            highlight,
            description,
            product_link,
            image:req.files.map(f => ({ url: f.path, filename: f.filename }))
        });
        await banner.save();
        res.redirect('/admin/viewbanner');
}

//To delete the product

const deleteProduct = async (req,res) =>{
    const prodId = req.body.productId;
    await Product.findByIdAndUpdate(prodId,{ deleteStatus:true });
    req.flash('success','Product Deleted Successfully');
    res.send({msg:''});
}

//Updating Product details by the admin

const productUpdate = async (req, res) => {
    try{
    const productId = req.params.id;
    const product = await Product.findByIdAndUpdate(productId,{...req.body},{
        deleteStatus:false
    })
    const img = req.files.map(f => ({url:f.path,filename:f.filename}))
    product.image.unshift(...img)
    await product.save();
    req.flash('success','Product Updated Successfully.')
    res.redirect('/admin/viewproducts');
    }catch(err){
    res.render('404NotFound');
}
}

//To block the user from our Website

const userBlock = async (req,res) => {
    const userId = req.body.userId;
    const status = req.body.status;
    if(status=='true'){
    await User.findByIdAndUpdate(userId,{ blockStatus:true });
    }else{
    await User.findByIdAndUpdate(userId,{ blockStatus:false });
    }
    res.send({msg:''})
}

//To delete Brands

const brandDelete = async (req, res) => {
    try{
    const brandId = req.params.id;
    await Brand.findByIdAndDelete(brandId);
    res.redirect('/admin/viewbrands');
    }catch(err){
        res.render('404NotFound');
    }
}

//Rendering specific product from ordered list

const productLoad = async (req, res) => {
    try{
    const proId = req.params.id;
    const editProduct = await Product.findById(proId);
    const brandDisplay = await Brand.find({});
    res.render('Admin/product_edit', { editProduct,brandDisplay });
    }catch(err){
        res.render('404NotFound');
    }
}

//Rendering ordered product list

const orderedProducts = async(req,res)=>{
    let {id} =req.query;
    id = mongoose.Types.ObjectId(id)
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
        res.render('Admin/ordered_products',{productDetails})
    }
    catch(err){
        res.send(err);
    }
}

//Checking Login details for Admin login

const signin = async (req, res) => {
    const { email, password } = req.body;
    // const admin = await Admin.findOne({ email });
    const confidentialEmail = 'admin@gmail.com';
    const confidentialPassword = '12345'
   
        if (email == confidentialEmail && password == confidentialPassword){
            req.session.userType = 'admin';
            req.session.adminId = '2848';
            req.flash('success', 'Successfully Logged In');
            res.redirect('/admin/dashboard');
        }
        else {
            req.flash('error', 'invalid email or password');
            res.redirect('/admin/signin');

        }
}

//Admin Dashboard rendering

const adminDashbord = async (req, res) => {
    const totalAmount= await Checkout.aggregate([
        { $group: { _id: null, bill: { $sum: "$bill" } } }
    ]);
    const noOfUsers = await User.find({}).count();
    const amountToday = await Checkout.aggregate([
        { $match: { "createdAt": { $gt: new Date(Date.now()-86400000)}}},
        { $group: { _id: null, bill: { $sum: "$bill" } } }
    ]);
    const latestSales = await Checkout.find({}).sort({createdAt: -1}).limit(5);
    const graph = await Checkout.aggregate(
        [
           {
             $group : {
                _id : { month: { $month: "$createdAt" }, day: { $dayOfMonth: "$createdAt" }, year: { $year: "$createdAt" } },
                totalPrice: { $sum: '$bill' },
                count: { $sum: 1 }
             }
           },{$sort:{_id:-1}},
           {$project:{totalPrice:1,_id:0}},{$limit:5}
        ]
     );
     let values = [];
     graph.forEach((g)=>{
        values.push(g.totalPrice);
     });
     const ordered = await Checkout.find({$and: [
        { createdAt: { $gt: Date.now()-2.628e+9 } },
        { orderStatus: { $elemMatch :{ type:'ordered' } } }
     ]}).count();

     const packed = await Checkout.find({$and: [
        { createdAt: { $gt: Date.now()-2.628e+9 } },
        { orderStatus: { $elemMatch :{ type:'packed' } } }
     ]}).count();

     const shipped = await Checkout.find({$and: [
        { createdAt: { $gt: Date.now()-2.628e+9 } },
        { orderStatus: { $elemMatch :{ type:'shipped' } } }
     ]}).count();

     const delivered = await Checkout.find({$and: [
        { createdAt: { $gt: Date.now()-2.628e+9 } },
        { orderStatus: { $elemMatch :{ type:'delivered' } } }
     ]}).count();

     const cancelled = await Checkout.find({$and: [
        { createdAt: { $gt: Date.now()-2.628e+9 } },
        { orderStatus: { $elemMatch :{ type:'cancelled' } } }
     ]}).count();
    res.render('Admin/admin_dashboard',{totalAmount,noOfUsers,amountToday,latestSales,values,ordered,packed,shipped,delivered,cancelled})
}

//Logout of Admin

const logout = (req, res) => {
    req.flash('sucess','Successfully Logout')
    req.session.destroy();
    res.redirect('/admin/signin');
}

//To delete Banner

const bannerDelete = async (req, res) => {
    try{
    const bannerId = req.body.bannerId;
    await Banner.findByIdAndDelete(bannerId);
    req.flash('success','Successfully Deleted the Banner');
    res.redirect('/admin/viewbanner');
    }catch(err){
        res.render('404NotFound');
    }
}

//User details showing

const userDetailsLoad = async (req, res) => {
    let userDisplay = await User.find({});
    res.render('Admin/admin_user', { userDisplay });
}

//Brand details showing

const brandDetailsLoad = async (req, res) => {
    const brandDisplay = await Brand.find({});
    res.render('Admin/admin_brand', { brandDisplay });
}

//Rendering add brand page

const addBrandView = (req, res, next) => {
    res.render('Admin/add_brand');
}

//Product details showing

const productDetailsLoad = async (req, res) => {
    const productDisplay = await Product.find({});
    res.render('Admin/admin_product', { productDisplay });
}

//Banner details showing

const bannerDetailsLoad = async (req,res) => {
    const bannerDisplay = await Banner.find({});
    res.render('Admin/admin_banner',{bannerDisplay});
}

//Order details showing

const orderDetailsLoad = async (req,res) =>{
    const orders = await Checkout.find({}).sort({createdAt: -1})
    res.render('Admin/admin_orders',{orders});
}

//For changing order status

const changeStatus = async (req,res) =>{
    let orderId = new mongoose.Types.ObjectId(req.body.orderId);
    const id = await Checkout.findById({_id:orderId});
    let orderStatusId = id.orderStatus[0]._id;
    const status = req.body.status;
    await Checkout.findOneAndUpdate({ $and: [{_id: orderId }, { "orderStatus._id": orderStatusId }] },{ $set: { "orderStatus.$.type": status }});
    req.flash('success','Successfully Updated');
    res.redirect('/admin/vieworders')
}

//Rendering add Poduct page

const addProductView = async (req, res) => {
    const brandDisplay = await Brand.find({});
    res.render('Admin/add_product', { brandDisplay })
}

//Rendering add Banner page

const addBannerView = async (req,res) => {
    res.render('Admin/add_banner');
}

//For adding new Brand

const addBrand = async (req, res) => {
    const exist_brand = await Brand.findOne({ brand_name: req.body.brand_name });
    if (exist_brand) {
        req.flash('error','Brand Already exits')
        res.render('add_brand');
    } else {
        const { brand_name } = req.body;
        const brand = new Brand({
            brand_name: brand_name
        });
        await brand.save();
        res.redirect('/admin/viewbrands');
    }
}


module.exports = {
    insertProduct,bannerDelete,changeStatus,orderedProducts,deleteProduct,userDetailsLoad, brandDetailsLoad,orderDetailsLoad,insertBanner, productLoad, brandDelete, userBlock, productUpdate,
    productDetailsLoad, signin, signinPage, adminDashbord,addBannerView, bannerDetailsLoad, logout, addBrandView, addProductView, addBrand,
};