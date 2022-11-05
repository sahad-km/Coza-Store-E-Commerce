const mongoose = require('mongoose')

const couponSchema = new mongoose.Schema({
   code:{
       type: String,
       required: true
   },
   discount:{
       type: Number,
       required: true
   },
   expiresAt:{
       type:Date,
       default:Date.now() + 604800000
   }

})

module.exports = mongoose.model('Coupon',couponSchema)