const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const brandSchema = new Schema({
    brand_name: String
})
const Brand = mongoose.model('Brand', brandSchema);
module.exports = Brand;