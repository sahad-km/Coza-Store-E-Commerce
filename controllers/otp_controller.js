const bcrypt = require('bcrypt');
const otpVerification = require('../models/userOtpVerify');
const User = require('../models/userSchema');
  

const sendOTPVerificationEmail = async(req,res) => {
    console.log('1');
    const exist_email = await User.findOne({email:req.body.email});
    if(exist_email) {
        console.log('2');
        req.flash('error','Email is already exists. Try with another')
        res.redirect('/users/register')
    } else {
        console.log('3');
        try{
            const otp = `${Math.floor(1000 + Math.random() * 9000)}`
    
            const mailOptions = {
                from: process.env.AUTH_EMAIL,
                to: email,
                subject: "Verify your email",
                html: `<p>Enter <b>${otp}</b> in the app to verify your email address and complete the sign up </p><p> This code <b> Expires in 10 Minutes</b>.</p>`
            }
            const hashedOTP = await bcrypt.hash(otp,10);
            console.log(req.session._id)
            const newOTPVerification = new otpVerification({
                userId: _id,
                otp: hashedOTP,
                createdAt: Date.now(),
                expiresAt: Date.now() + 600000
            })
            await newOTPVerification.save()
            await transporter.sendMail(mailOptions)
            req.flash('success','An OTP has sended to your Email')
            console.log(email)
           
        }
        catch(err){
            res.json({
                status: "FAILED",
                message: err.message,
            })
        }
    }
    
}

const verifyOTP = async (req,res) => {
    const exist_user = await User.findOne({email:req.body.email});
        if(exist_user) {
            res.render('register',{title:'Create Account',msg:'User already exist'});
        }else {
            console.log(req.body);
            const {name,email,mobNumber,otp,password,userType} = req.body;
            const hashedPassword = await bcrypt.hash(password,10);

            if(!otp) {
                // throw Error("Empty OTP details are not allowed")
                req.flash('error','Empty OTP details are not allowed')
            } else {
                const UserOTPVerificationRecords = await otpVerification.find({otp})
    
                if(UserOTPVerificationRecords.length <= 0) {
                    // throw new Error("Account record doesn't exist or has been verified already. Please sign up or login.")
                    req.flash('error',"Account record doesn't exist or has been verified already. Please sign up or login.")
                    res.redirect('/signup')
                } else {
                    const { expiresAt } = UserOTPVerificationRecords[0]
                //     const hashedOTP = UserOTPVerificationRecords[0].otp
    
                    console.log(expiresAt)
     
                    if (expiresAt < Date.now()) {
                        await otpVerification.deleteMany({ userId })
                        await userData.findByIdAndDelete(userId)
                        // throw new Error("OTP has expired. Please request again.")
                        req.flash('error',"OTP has expired. Please request again. Try after 10 minutes")
                        res.redirect('/signup')
                        
                    } else {
                        const validOTP= await bcrypt.compare(otp,hashedOTP);
    
                        if(!validOTP) {
                            // throw new Error("Invalid code passed. Check your inbox.")
                            req.flash('error',"Invalid code passed. Check your inbox. Try after 10 minutes")
                            res.redirect('/signup')
                        } else {
                            
                           await userData.updateOne({ _id: userId }, { verified: true })
                           await otpVerification.deleteMany({ userId })
                             
                            req.flash('success','Successfully Registered')
                           res.render('user/loginPage')
                        }
                    }
    
                }
    
            }



            const user = new User({
            name:name,
            email:email,
            mobNumber:mobNumber,
            password:hashedPassword,
            userType:user
        });
        await user.save();
        console.log('here now...');
        res.render('login',{title:'login',msg:'Account created, Please login',errmsg:''});
    }
}


const verifyOTP1 = async(req,res) => {
    try{
        const {userId, otp, hashedOTP} = req.body
        console.log(userId)
        console.log(hashedOTP)

        console.log(otp)
        
        if(!userId || !otp) {
            // throw Error("Empty OTP details are not allowed")
            req.flash('error','Empty OTP details are not allowed')
        } else {
            console.log(userId)
           console.log(otpVerification.find({
                userId
           }))
            const UserOTPVerificationRecords = await otpVerification.find({ userId })

            console.log(UserOTPVerificationRecords)
            
            if(UserOTPVerificationRecords.length <= 0) {
                // throw new Error("Account record doesn't exist or has been verified already. Please sign up or login.")
                req.flash('error',"Account record doesn't exist or has been verified already. Please sign up or login.")
                res.redirect('/signup')
            } else {
                const { expiresAt } = UserOTPVerificationRecords[0]
            //     const hashedOTP = UserOTPVerificationRecords[0].otp

                console.log(expiresAt)
 
                if (expiresAt < Date.now()) {
                    await otpVerification.deleteMany({ userId })
                    await userData.findByIdAndDelete(userId)
                    // throw new Error("OTP has expired. Please request again.")
                    req.flash('error',"OTP has expired. Please request again. Try after 10 minutes")
                    res.redirect('/signup')
                    
                } else {
                    const validOTP= await bcrypt.compare(otp,hashedOTP);
                    
                    
                    console.log(otp+"one");
                    console.log(hashedOTP+"two");


                    if(!validOTP) {
                        // throw new Error("Invalid code passed. Check your inbox.")
                        req.flash('error',"Invalid code passed. Check your inbox. Try after 10 minutes")
                        res.redirect('/signup')
                    } else {
                        
                       await userData.updateOne({ _id: userId }, { verified: true })
                       await otpVerification.deleteMany({ userId })
                         
                        req.flash('success','Successfully Registered')
                       res.render('user/loginPage')
                    }
                }

            }

        }
    } catch (err) {
        res.json({
            status: "FAILED",
            message: err.message

        })

    }

}

module.exports = {sendOTPVerificationEmail};