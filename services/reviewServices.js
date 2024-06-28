const Reviews = require('../models/reviewModel')
exports.createReview = async (req, res) => {
    try {
        if (!req.body.product) req.body.product=req.params.productId
        if (!req.body.user) req.body.user=req.currentuser._id
        const Review = await Reviews.create(req.body )
        res.status(201).json({ status: 'success', Data: Review })
    }
    catch (err) { res.status(500).json({ status:'fail', Data: err}) }
}
exports.Reviews_get_all = async (req, res) => {
    try {
        let filter={}
if (req.params.productId) { filter={ product: req.params.productId } }

        const page = req.query.page*1||1
        const limit = req.query.limit * 1 || 5
        const skip=(page-1)*limit
        const Review = await Reviews.find(filter).skip(skip).limit(limit)

        res.status(200).json({ count: Review.length ,status: 'success', Data: Review })
    }
    catch (err) { res.status(500).json({ status:'fail', Data: err}) }
}
exports.get_one_Review = async (req, res) => {
    try {

        const Review = await Reviews.findById(req.params.Id)

        res.status(200).json({ count: Review.length ,status: 'success', Data: Review })
    }
    catch (err) { res.status(500).json({ status:'fail', Data: err}) }
}
exports.update_Review = async (req, res) => {
    try {
        const Review = await Reviews.findByIdAndUpdate(req.params.Id,req.body,{ new: true, runValidators: true })

        res.status(200).json({ status: 'success', Data: Review })
    }
    catch (err) { res.status(500).json({ status:'fail', Data: err}) }
}

exports.delete_Review = async (req, res) => {
    try {

        await Reviews.findByIdAndDelete(req.params.Id)

        res.status(200).json({ status: 'success' })
    }
    catch (err) { res.status(500).json({ status:'fail', Data: err}) }
}

