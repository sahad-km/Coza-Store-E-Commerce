const CouponData = require('../models/couponSchema');
const Checkout = require('../models/checkoutSchema');


const coupons = async(req,res) => {
    try{
        const coupon = await CouponData.find({})
        res.render('Admin/admin_coupon',{coupon})
    } catch(err) {
        console.log(err)
    }
}

const addCouponView = async(req,res) => {
    try{
        res.render('Admin/add_coupon')
    } catch(err) {
        console.log(err)
    }
}

const saveCoupon = async(req,res) => {
    try {
        const coupon = new CouponData ({
            code: req.body.code,
            discount: req.body.discount
        })
        await coupon.save()
        req.flash('success','Coupon added successfully')
        res.redirect('/admin/viewcoupons')
    } catch(err) {
        console.log(err)
    }
}

const deleteCoupon = async(req,res) => {
    try{
        const {id} = req.params
        await CouponData.findByIdAndDelete(id)
        res.redirect('/admin/viewcoupons')
    } catch(err) {
        console.log(err)
    }
}


const applyCoupon = async(req,res) => {
   try{
        const usercode = req.body.code
        const code = await CouponData.find({code: usercode})
        if(code){
            const userId = req.session.userId
            await Checkout.findOneAndUpdate({userId},{couponCode:usercode})
            const discount = code[0].discount    
            res.send({success:discount})
        } else {
            req.flash('error','Invalid code')
            res.redirect('/users/viewcart')
        }
   } catch(err) {
        console.log(err)
   }
}


module.exports = {
    coupons,
    addCouponView,
    applyCoupon,
    saveCoupon,
    deleteCoupon
}