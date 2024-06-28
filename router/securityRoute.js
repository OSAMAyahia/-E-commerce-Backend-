const categorySchema = require('../services/securityUser');
const express = require('express');
const router = express.Router();

router.route('/signup').post(categorySchema.signup)
router.route('/login').post(categorySchema.login)
router.route('/forgetPassword').post(categorySchema.forgetPassword)
router.route('/ResetPassword/:code').post(categorySchema.ResetPassword)
router.route('/updatePassword').post(categorySchema.protect,categorySchema.updatePassword)


module.exports = router;