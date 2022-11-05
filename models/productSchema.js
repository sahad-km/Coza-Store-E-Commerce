const mongoose = require('mongoose');

const Schema = mongoose.Schema;
ObjectId = Schema.ObjectId;
const productSchema = new Schema({
    product_name: {
        type: String,
        required: true,
        trim: true
    },
    product_brand :String,
    product_description: {
        type: String,
        required: true,
        trim: true
    },
    product_stock: [
        {
        stock1: Number,
        stock2: Number,
        stock3: Number,
        stock4: Number,
        stock5: Number
        }
    ],
    selling_price: {
        type: Number,
        required: true,
        trim: true
    },
    org_price:{
        type: Number,
        required: true,
        trim: true
    },
    image: [
        {
            url: String,
            filename: String
        }
    ],
    deleteStatus:{
        type:Boolean,
        default:false
    }
},{
    timestamps:true
});
const Product = mongoose.model('Product', productSchema);
module.exports = Product;