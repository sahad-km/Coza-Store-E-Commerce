const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true
    },
    mobNumber: Number,
    password: {
        type: String,
        required: true,
    },
    userType: {
        type: String,
    },
    address: [
        {
           fullName:String,
           email:String,
           mobNumber:Number,
           houseName: String,
           city: String,
           state:String,
           pincode:String,
           country:String
        }
    ],
    blockStatus:{
        type:Boolean,
        default:false
    }
},
{
    timeseries:true
})
const User = mongoose.model('User', userSchema);
module.exports = User;