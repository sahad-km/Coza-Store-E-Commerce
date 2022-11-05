const mongoose = require('mongoose')
const Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;
const checkoutSchema = new mongoose.Schema({
  userId: {
    type: ObjectId,
  },
  cartItems:[
    {
        productId:{
            type:ObjectId,
            required:true
        },
        quantity:{
            type:Number,
            required:true
        },
        variant:String
    }
],
  address: String,
  paymentStatus: {
    type: String,
    enum: ["cod", "razorpay"],
  },
  bill: {
    type: Number,
    required: true
  },
  orderStatus: [{
    type: {
      type: String,
      enum: ["ordered", "packed", "shipped", "delivered", "cancelled"],
      default: "ordered"
    },
    date: {
      type: Date
    }
    
  }],
  isCompleted: {
    type: Boolean,
    default: false
  },
  expectedDate: {
    type: Date,
    default: () => new Date(+ new Date() + 7 * 24 * 60 * 1000)
  },
  orderId: {
		type: String,
	},
	receiptId: {
		type: String
	},
	paymentId: {
		type: String,
	},
	signature: {
		type: String,
	},
	amount: {
		type: Number
	},
	currency: {
		type: String
	},
	createdAt: {
		type: Date
	},
	status: {
		type: String
	},
  couponCode:{
    type:String
  }
}, { timestamps: true })


const Checkout = mongoose.model('Checkout', checkoutSchema);
module.exports = Checkout;