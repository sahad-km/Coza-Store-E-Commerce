const express = require('express');
const mongoose = require('mongoose')
const router = express.Router();
const Razorpay = require('razorpay');
const crypto = require('crypto');
const CheckOut = require('../models/checkoutSchema');
const Cart = require('../models/cartSchema');
const User = require('../models/userSchema');


let instance = new Razorpay({
  key_id:'rzp_test_y5gvtRY9ZcI4Xg',
  key_secret:'6JbOr7pwWgHnEwX5VhHBN5En',
});


const placeOrder = async (req, res) => {
  let userId = req.session.userId;
  let status = req.body.payment === 'cod' ? true : false
  let items = await Cart.findById(req.body.cartId)
  const checkout = new CheckOut({
    userId: userId,
    cartItems: items.cartItems,
    address: req.body.address,
    paymentStatus: req.body.payment,
    bill: req.body.totalAmount,
    orderStatus: [{
      date: Date.now(),
      isCompleted: status
    }],
  });
  let orderId = checkout._id
  await checkout.save();
  await Cart.deleteOne({_id:req.body.cartId})
  if (req.body.payment == 'cod') {
    res.send({ codSuccess: true,orderId })
  } else {
    const user = await User.findById(userId);
    const fullName = user.name
    const mobile = user.mobNumber
    const email = user.email
    const inserId = checkout._id;
    const options = {
      amount: 1000, // amount in the smallest currency unit
      currency: "INR",
      receipt: "" + inserId
    };
    instance.orders.create(options, function (err, order) {
      const orderId = order.id

      const userDetails = {
        fullName,
        mobile,
        email,
      };
      res.send({
        options,
        userDetails,
        orderId
      });
    })
  }
}


const verifyPayment = async (req,res) => {
  let cartId = req.body.cartId;
  const details = req.body
  let hmac = crypto.createHmac('sha256',process.env.KEY_SECRET)
  hmac.update(details.payment.razorpay_order_id +'|'+ details.payment.razorpay_payment_id,process.env.KEY_SECRET);
  hmac=hmac.digest('hex')
  if(hmac==details.payment.razorpay_signature){
    const id = mongoose.Types.ObjectId(details.payDetails.receipt)
  await CheckOut.findByIdAndUpdate(id,{isCompleted:true});
  await Cart.deleteOne({_id:cartId})
    res.send({ paymentOk: true,id:details.payDetails.receipt})
  }
}
  module.exports = { placeOrder,verifyPayment};