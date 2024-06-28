const brandServices = require('../services/brandService');
const express = require('express');
const router = express.Router();
router.route('/').post(brandServices.createBrand).get(brandServices.getBrands)
router.route('/:Id').get(brandServices.getBrand).patch(brandServices.updateBrand).delete(brandServices.deleteBrand)

module.exports = router;