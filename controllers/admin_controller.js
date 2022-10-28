const bcrypt = require('bcrypt');
const Admin = require('../models/adminSchema');
const Brand = require('../models/brandSchema');
const User = require('../models/userSchema');
const Product = require('../models/productSchema');


const signinPage = (req, res) => {
    res.render('admin_login', { message: req.flash('invalid') })
    // console.log(req.session.username);
}
const insertProduct = async (req, res) => {
    console.log(req.body);
    const exist_product = await Product.findOne({ product_name: req.body.product_name });
    if (exist_product) {
        res.render('admin_product', { msg: 'Product already exist' });
    } else {
        const {product_name,product_brand,product_description,stock1,stock2,stock3,stock4,stock5,selling_price,org_price} = req.body;
        console.log(stock2,stock3,stock4,stock5);
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
        console.log(req.body.product);
        // const product = new Product(req.body.product)
        // product.image = req.files.map(f => ({ url: f.path, filename: f.filename }));
        // await product.save();
        console.log('here now...');
        res.redirect('/admin/viewproducts');
    }
}

const userUpdate = async (req, res) => {
    const userId = req.params.id;
    const { name, email, mobNumber, userType } = req.body;
    // console.log(req.body);
    const detailsToUpdate = {
        $set: {
            name: name,
            email: email,
            mobNumber: mobNumber,
            userType: userType
        }
    };
    await User.findByIdAndUpdate(userId, detailsToUpdate);
    res.redirect('/admin/dashboard');
}

const userDelete = async (req, res) => {
    const userId = req.params.id;
    await User.findByIdAndDelete(userId);
    res.redirect('/admin/viewusers');
}

const brandDelete = async (req, res) => {
    const brandId = req.params.id;
    await Brand.findByIdAndDelete(brandId);
    res.redirect('/admin/viewbrands');
}

const userLoad = async (req, res) => {
    // console.log(req.params);
    const userId = req.params.id;
    console.log(userId);
    const editUser = await User.findById(userId);
    // console.log(editUser);
    res.render('userEdit', { editUser });
}

const signin = async (req, res) => {
    const { email, password } = req.body;
    console.log(req.body);
    const admin = await Admin.findOne({ email });
    if (admin) {
        const validPassword = await bcrypt.compare(password, admin.password);
        if (validPassword) {
            req.session.email = admin.email;
            console.log("logged in");
            res.redirect('/admin/dashboard');
        }
        else {
            req.flash('invalid', 'invalid email or password');
            res.redirect('/admin/signin');

        }
    }
    else {
        req.flash('invalid', 'invalid email or password');
        res.redirect('/admin/signin');
    }

}

const adminDashbord = (req, res) => {
    res.render('admin_dashboard')
}


const logout = (req, res) => {
    req.session.destroy();
    res.redirect('/admin/signin')
}

const sessionCheck = (req, res, next) => {
    if (req.session.email) {
        res.render('admin_dashboard');
    } else {
        next();
    }
}
const userDetailsLoad = async (req, res) => {
    let userDisplay = await User.find({});
    res.render('admin_user', { userDisplay });
    // console.log(userDisplay);
    // res.render('admin_user',userDisplay);
}

const brandDetailsLoad = async (req, res) => {
    const brandDisplay = await Brand.find({});
    res.render('admin_brand', { brandDisplay });
}

const addBrandView = (req, res, next) => {
    res.render('add_brand')
}

const productDetailsLoad = async (req, res) => {
    const productDisplay = await Product.find({});
    console.log(productDisplay);
    res.render('admin_product', { productDisplay });
}

const addProductView = async (req, res) => {
    const brandDisplay = await Brand.find({});
    // console.log(brandDisplay);
    res.render('add_product', { brandDisplay })
}

const addBrand = async (req, res) => {
    console.log(req.body.brand_name)
    const exist_brand = await Brand.findOne({ brand_name: req.body.brand_name });
    if (exist_brand) {
        res.render('add_brand', {msg: 'Brand already exist' });
    } else {
        const { brand_name } = req.body;
        const brand = new Brand({
            brand_name: brand_name
        });
        await brand.save();
        console.log('here now...');
        res.redirect('/admin/viewbrands');
    }
}

const sessionCheckDashboard = (req, res, next) => {
    if (req.session.email) {
        next();
    }
    else {
        console.log('here...')
        res.render('admin_dashboard');
    }

}
module.exports = {
    insertProduct, sessionCheckDashboard, sessionCheck, userDetailsLoad, brandDetailsLoad, userLoad, brandDelete, userDelete, userUpdate,
    productDetailsLoad, signin, signinPage, adminDashbord, logout, addBrandView, addProductView, addBrand,
};