const bcrypt = require('bcrypt');
const otpVerification = require('../models/userOtpVerify');
const User = require('../models/userSchema');
const nodemailer = require('nodemailer');

let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    auth: {
        user: process.env.AUTH_EMAIL, 
        pass: process.env.AUTH_PASS
    }
})

const sendOTPVerificationEmail = async(req,res) => {
    const email = req.body.email;
    const exist_email = await User.findOne({email:email});
    if(exist_email) {
        req.flash('error','Email is already exists. Try with another')
        res.redirect('/users/register')
    } else {
        try{
            const otp = `${Math.floor(1000 + Math.random() * 9000)}`
    
            const mailOptions = {
                from: process.env.AUTH_EMAIL,
                to: email,
                subject: "Verify your email",
                html: `<p>Enter <b>${otp}</b> in the app to verify your email address and complete the sign up </p><p> This code <b> Expires in 10 Minutes</b>.</p>`
            }
            const hashedOTP = await bcrypt.hash(otp,10);
            const newOTPVerification = new otpVerification({
                email: email,
                otp: hashedOTP,
                createdAt: Date.now(),
                expiresAt: Date.now() + 600000
            })
            await newOTPVerification.save()
            await transporter.sendMail(mailOptions)
            res.send({success:true})
        }
        catch(err){
            res.json({
                status: "FAILED",
                message: err.message,
            })
        }
    }
    
}



const otpVerify = async (req,res)=> {
    const email = req.body.email;
    const otp = req.body.otp;
    const user = await otpVerification.findOne({ email });
    if (user) {
        const validOtp = await bcrypt.compare(otp, user.otp);
        if (validOtp) {
            await otpVerification.deleteMany({email})
            res.send({verify:true});
        }
        else {
            req.flash('error', 'invalid OTP entered');
            res.redirect('/users/register');
        }
    }
    else {
        req.flash('error', 'invalid OTP entered');
        res.redirect('/users/register');
    }
}


module.exports = {sendOTPVerificationEmail,otpVerify};