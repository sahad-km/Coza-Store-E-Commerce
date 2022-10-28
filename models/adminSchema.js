const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const adminSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    mobNumber: String,
    password: {
        type: String,
        required: true,
        trim: true
    },
    userType: {
        type: String,
        required: true
    }

})
const Admin = mongoose.model('Admin', adminSchema);
module.exports = Admin;