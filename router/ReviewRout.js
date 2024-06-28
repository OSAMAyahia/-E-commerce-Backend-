const Review = require('../services/reviewServices');;
const secure = require('../services/securityUser');;
const express = require('express');
const router = express.Router({mergeParams: true});
router.route('/').post(secure.protect,Review.createReview).get(Review.Reviews_get_all)
router.route('/:Id').get(Review.get_one_Review).patch(Review.update_Review).delete(Review.delete_Review)

module.exports = router;