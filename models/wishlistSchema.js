const mongoose=require('mongoose');
const Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;
const wishlistSchema = mongoose.Schema({
    userId:{
        type:ObjectId,
        required:true,
    },
    wishlistItems:[
        {
            productId:{
                type:ObjectId,
                required:true
            },
            variant:String
        }
    ]
});

const Wishlist = mongoose.model('Wishlist', wishlistSchema);
module.exports = Wishlist;