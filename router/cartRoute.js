const cartServices = require('../services/cartServices');
const protect = require('../services/securityUser');
const express = require('express');
const router = express.Router();
router.route('/').post(protect.protect, cartServices.addProductToCart).get(protect.protect, cartServices.getProductToCart)
    .delete(protect.protect, cartServices.clearAllProductfromCart)
router.route('/:itemId').delete(protect.protect, cartServices.deleteProductfromCart).patch(protect.protect, cartServices.updateQuantity)
router.post('/applyCoupon',protect.protect, cartServices.totalPriceAfterDiscount)
module.exports = router;