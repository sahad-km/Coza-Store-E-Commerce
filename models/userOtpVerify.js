const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const OTPVerification = new Schema({
    email:{
        type:String,
        required:true
    },
    otp: String,
    createdAt: Date,
    expiresAt: Date,
});

const OtpVerification = mongoose.model('Otp', OTPVerification);
module.exports = OtpVerification;