const subCategorySchema = require('../models/subCategoryModel')
const slugify = require('slugify')

exports.createCategory = async (req, res) => {
    try {
        if (!req.body.category) {req.body.category=req.params.idcat}
        const subcategory = await subCategorySchema.create({
            name: req.body.name, slug: slugify(req.body.name), category: req.body.category
            
        })

        res.status(201).json({ status: 'success', Data: subcategory })
    }
    catch (err) { res.status(501).json({ status: 'fail', Data: err }), console.log(err) }
}
    
exports.catget_all = async (req, res) => {
    try {
        limit = req.query.limit*1 || 5;
        page = req.query.page*1 || 1
        skip = (page - 1) * limit;
        let filter = {}
        if (req.params.idcat) { filter = { category: req.params.idcat } }
        const category = await subCategorySchema.find(filter).skip(skip).limit(limit)

        res.status(200).json({ count: category.length ,status: 'success', Data: category })
    }
    catch (err) { res.status(500).json({ status:'fail', Data: err}) ,console.log(err)}
}
exports.get_one_catget = async (req, res) => {
    try {

        const category = await subCategorySchema.findById(req.params.Id)

        res.status(200).json({ count: category.length ,status: 'success', Data: category })
    }
    catch (err) { res.status(500).json({ status:'fail', Data: err}) }
}


exports.update_catget = async (req, res) => {
    try {

        const category = await subCategorySchema.findByIdAndUpdate(req.params.Id,req.body,{ new: true, runValidators: true })

        res.status(200).json({ count: category.length ,status: 'success', Data: category })
    }
    catch (err) { res.status(500).json({ status:'fail', Data: err}) }
}

exports.delete = async (req, res) => {
    try {

        const category = await subCategorySchema.findByIdAndDelete(req.params.Id)

        res.status(200).json({ status: 'success' })
    }
    catch (err) { res.status(500).json({ status:'fail', Data: err}) }
}
