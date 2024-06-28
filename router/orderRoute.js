const order = require('../services/orderService');
const protect = require('../services/securityUser');
const express = require('express');
const router = express.Router();
router.route('/').get(protect.protect, order.getallOrders)
// router.route('/:id/pay').patch(protect.protect,protect.restrictTo('admin'),order.updatedOrderPaid)
// router.route('/:id/delivered').patch(protect.protect,protect.restrictTo('admin'), order.updateddelivered)
router.route('/:id').post(protect.protect, order.CreateCashOrder).get(protect.protect,protect.restrictTo('user'),order.getone)
router.route('/checkout/:id').get(protect.protect,protect.restrictTo('user'),order.checkoutSession)
module.exports = router;