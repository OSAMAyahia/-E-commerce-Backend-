const userSchema = require('../models/userModel')
const slugify = require('slugify')
exports.createUser = async (req, res) => {
    try {
        req.body.slug=slugify(req.body.name)
        const User =  await userSchema.create(req.body)
        res.status(201).json({ status: "succes", data: User })
    } catch (err) { res.status(401).json({ status: "fail", err: err }) }
}
exports.deleteUser = async (req, res) => {
    try {
         await userSchema.findByIdAndDelete(req.params.userId)
        res.status(200).json({ status: "succes" })
    } catch (err) { res.status(401).json({ status: "fail", err: err }) }
}

exports.updateUser = async (req, res) => {
    try {
        const User =  await userSchema.findByIdAndUpdate(req.params.userId,{
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone,
            slug:req.body.name
        },{new:true})
        res.status(200).json({ status: "succes", data: User })
    } catch (err) { res.status(401).json({ status: "fail", err: err }) }
}

exports.findALLUserS = async (req, res) => {
    try {
        const User =  await userSchema.find()
        res.status(200).json({ status: "succes", data: User })
    } catch (err) { res.status(401).json({ status: "fail", err: err }) }
}
exports.findOneUser = async (req, res) => {
    try {
        const User =  await userSchema.findById(req.params.userId);
        res.status(200).json({ status: "succes", data: User })
    } catch (err) { res.status(401).json({ status: "fail", err: err }) }
}
exports.deleteloggedUser = async (req, res) => {
    try {
        const User =  await userSchema.findByIdAndUpdate(req.currentuser._id,{active:false});
        res.status(304).json({ status: "succes", data: null })
    } catch (err) { res.status(401).json({ status: "fail", err: err }) }
}
exports.reactivateUser = async (req, res) => {
    try {
        const user = await userSchema.findByIdAndUpdate(
            req.params.Ids,
            { active: true },
            { new: true }
        );
        if (!user) {
            return res.status(404).json({ status: "fail", message: "User not found" });
        }
        res.status(200).json({ status: "success", data: { user } });
    } catch (err) {
        res.status(400).json({ status: "fail", error: err.message });
    }
};