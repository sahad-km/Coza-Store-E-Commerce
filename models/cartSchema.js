const mongoose=require('mongoose');
const Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;
const cartSchema = mongoose.Schema({
    userId:{
        type:ObjectId,
        required:true,
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
    ]
});

const Cart = mongoose.model('Cart', cartSchema);
module.exports = Cart;