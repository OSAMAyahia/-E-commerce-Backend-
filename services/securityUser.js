const User = require('../models/userModel');
const token = require('jsonwebtoken');
const email = require('../utils/sendEmail');
const crypto = require('crypto');
exports.signup = async (req, res) => {
    try{ const user = await User.create({
             name: req.body.name,
             email: req.body.email,
             password: req.body.password,
             confirmation_password: req.body.confirmation_password,
             role: req.body.role
    })
const jwt= token.sign({id:user._id},process.env.SECRECT,{expiresIn:process.env.EX}) 
      res.status(200).json({ status: "success", data: user,token:jwt })  }         
    catch (error) { res.status(500).json({ error });}
} 

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body
        if (!email || ! password) return res.status(404).json({ status: "error", message: "please enter email and password " })  
        const user = await User.findOne({ email: email })
        if (!user || (!await user.comparepass(password,user.password))) return res.status(404).json({ status: "error", message: "the email or password error" })  
            const jwt= token.sign({id:user._id},process.env.SECRECT,{expiresIn:process.env.EX}) 
                   res.status(200).json({ status: "success", jwt } )
   }
   catch (error) { res.status(500).json({ error });}
}
    
exports.protect = async (req, res,next) => {
    try {
        let tokens;
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer'))
        { tokens = req.headers.authorization.split(' ')[1] }    
        // console.log(token)
        const de = token.verify(tokens, process.env.SECRECT)
        // console.log(de)
        const user = await User.findOne({ _id: de.id })
        if (!user) return res.status(404).json({ status: "error", message: "please log in first" })  
        req.currentuser = user
      next()
   }catch (error) { res.status(500).json({ error });}}
  
exports.restrictTo = (...role) => {
    try{return (req, res, next) => {
        if (!role.includes(req.currentuser.role)) return res.status(403).json({ status: "error", message: "You Don’t Have Permission to Access This " });
    next();
    }
    } catch (err) { res.status(403).json({ status: "error", err }) }
}
    

exports.forgetPassword = async(req, res) => { 
    try {
        const user = await User.findOne({ email: req.body.email })
        if (!user) return res.status(404).json({ status: "error", message: "this user is not exist" })
        const codes = user.generateCode()
        // console.log(codes)
        await user.save({ validateBeforeSave: false })
        messages = `Hello ${user.name},\n we've received a request to reset your password for your account.
     If you didn't make this request, don't worry.
     Your account is still secure, and no action is needed.\n${codes}`
        await email({ email: user.email, subject: 'your reset code, please dont share your reset code', message: messages })
        res.status(200).json({
            status: 'success',
            message: "Token sent to email!"
        });
    }catch (err) { res.status(403).json({ status: "error", err})}

    
    // generate code
    // send code 
    // save it in db}
}

exports.ResetPassword =async (req, res) => {
    //params code
    //will check if code === code i db 
    // if erorr will send err
    //ellse will take pass and con_code and save 
try{  const codes= crypto.createHash('sha256').update(req.params.code).digest('hex')
    const user =await User.findOne({ passwordResetToken: codes , passwordresetExpires: { $gt:Date.now()}})
    if (!user) return res.status(404).json({ status: "error", message: "this code is not true" })
    user.password = req.body.password
    user.confirmation_password = req.body.confirmation_password
    user.passwordResetToken=undefined
    user.passwordresetExpires=undefined
    await user.save()
    res.status(200).json({ status: "ok", message: 'your password has been changed' })
}
catch (err) { res.status(403).json({ status: "error", err }) }

}

exports.updatePassword = async (req, res) => {
    try { 
        const user = await User.findById( req.currentuser._id )
        if (!await user.comparepass(req.body.currentPassword, user.password)) {return res.status(400).json({ message: 'the currentPassword is not correct' })}
        user.password = req.body.password
        user.confirmation_password = req.body.confirmation_password
        await user.save()
        res.status(200).json({ message: "Password has been updated successfully" })       

    } catch (err) { res.status(401).json({'status':"error",message:err}) }
 }


    
