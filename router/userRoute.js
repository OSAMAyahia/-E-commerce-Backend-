const userservices = require('../services/userServices');
const secuirty = require('../services/securityUser');
const express = require('express');
const router = express.Router();

router.route('/deleteme').delete(secuirty.protect,userservices.deleteloggedUser)
router.route('/reactivateUser/:Ids').patch(userservices.reactivateUser);
router.route('/').post(userservices.createUser).get(secuirty.protect,userservices.findALLUserS)
router.route('/:userId').get(userservices.findOneUser).patch(userservices.updateUser).delete(secuirty.protect,secuirty.restrictTo('admin'),userservices.deleteUser)
module.exports = router;