const productModel = require('../models/productModel')
const slugify = require('slugify')

exports.createProduct = async (req, res) => {
    try {
        req.body.slug = slugify(req.body.title)
        const Product = await productModel.create(
       req.body
        )

        res.status(201).json({ status: 'success', Data: Product })
    }
    catch (err) { res.status(500).json({ status:'fail', Data: err}) }
}
exports.Productget_all = async (req, res) => {
    try {
        const page = req.query.page*1||1
        const limit = req.query.limit * 1 || 5
        const skip=(page-1)*limit
        const Product = await productModel.find().skip(skip).limit(limit).populate('reviews')

        res.status(200).json({ count: Product.length ,status: 'success', Data: Product })
    }
    catch (err) { res.status(500).json({ status:'fail', Data: err}) }
}
exports.get_one_Product = async (req, res) => {
    try {

        const Product = await productModel.findById(req.params.Id).populate("reviews")

        res.status(200).json({ count: Product.length ,status: 'success', Data: Product })
    }
    catch (err) { res.status(500).json({ status:'fail', Data: err}) }
}
exports.update_Product = async (req, res) => {
    try {

        if (req.body.title) {
            req.body.slug = slugify(req.body.title)
        }
        const Product = await productModel.findByIdAndUpdate(req.params.Id,req.body,{ new: true, runValidators: true })

        res.status(200).json({ count: Product.length ,status: 'success', Data: Product })
    }
    catch (err) { res.status(500).json({ status:'fail', Data: err}) }
}

exports.delete = async (req, res) => {
    try {

        await productModel.findByIdAndDelete(req.params.Id)

        res.status(200).json({ status: 'success' })
    }
    catch (err) { res.status(500).json({ status:'fail', Data: err}) }
}

