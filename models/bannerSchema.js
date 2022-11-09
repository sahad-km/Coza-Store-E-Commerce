const mongoose = require('mongoose');

const Schema = mongoose.Schema;
ObjectId = Schema.ObjectId;
const bannerSchema = new Schema({
    highlight: String,
    description : String,
    image: [
        {
            url: String,
            filename: String
        }
    ],
},{
    timestamps:true
});
const Banner = mongoose.model('Banner', bannerSchema);
module.exports = Banner;