const productService = require('../services/productService');;
const express = require('express');
const reviews = require('./ReviewRout');;
const router = express.Router();

router.use('/:productId/reviews', reviews)

router.route('/').post(productService.createProduct).get(productService.Productget_all)
router.route('/:Id').get(productService.get_one_Product).patch(productService.update_Product).delete(productService.delete)

module.exports = router;