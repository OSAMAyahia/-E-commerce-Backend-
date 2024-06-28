const CoponServices = require('../services/couponServices');
const security = require('../services/securityUser');
const express = require('express');
const router = express.Router();
router.use(security.protect, security.restrictTo('admin'))
router.route('/').post(CoponServices.createCopon).get(CoponServices.getCopons)
router.route('/:Id').get(CoponServices.getCopon).patch(CoponServices.updateCopon).delete(CoponServices.deleteCopon)

module.exports = router;