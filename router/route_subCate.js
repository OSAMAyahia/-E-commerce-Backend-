const categorySchema = require('../services/subCategoriesServices');
const express = require('express');
const router = express.Router({mergeParams: true});

router.route('/').post(categorySchema.createCategory).get(categorySchema.catget_all)
router.route('/:Id').get(categorySchema.get_one_catget).patch(categorySchema.update_catget).delete(categorySchema.delete)

module.exports = router;