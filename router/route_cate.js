const categorySchema = require('../services/categoryServices');
const routeSubCategory = require('./route_subCate');
const express = require('express');
const router = express.Router();
router.use('/:idcat/subCategory',routeSubCategory)
router.route('/').post(categorySchema.createCategory).get(categorySchema.catget_all)
router.route('/:Id').get(categorySchema.get_one_catget).patch(categorySchema.update_catget).delete(categorySchema.delete)

module.exports = router;