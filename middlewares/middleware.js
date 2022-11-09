const User = require("../models/userSchema");

const sessionCheck = (req, res, next) => {
    if (req.session.userId) {
        next();
    }else {
    res.redirect('/users/login');
}}

const loginSession = (req,res,next) => {
    if(req.session.userId){
        res.redirect('/');
    }else{
        next();
    }
}

const adminSession =(req,res,next) =>{
    if(req.session.adminId){
        next();
    }else{
        res.redirect('/admin/signin')
    }
}

const adminLoginSession = (req,res,next) => {
    if(req.session.adminId){
        res.redirect('/admin/dashboard')
    }else{
        next();
    }
}
const blocked = async (req,res,next) =>{
    const userId = req.session.userId;
    const user = await User.find({userId});
    if(user.blockStatus){
    req.session.destroy();
    res.redirect('/');
    }else{
        next();
    }
}

module.exports= {sessionCheck,loginSession,blocked,adminSession,adminLoginSession};
