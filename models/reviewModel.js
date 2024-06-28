const mongoose = require('mongoose');
const reviewSchema = new mongoose.Schema(
  {
    title: {
      type: String,
    },
    ratings: {
      type: Number,
      min: [1, 'Min ratings value is 1.0'],
      max: [5, 'Max ratings value is 5.0'],
      required: [true, 'review ratings required'],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Review must belong to user'],
    },
    // parent reference (one to many)
    product: {
      type: mongoose.Schema.ObjectId,
      ref: 'field_Product',
      required: [true, 'Review must belong to product'],
    },
  },
  { timestamps: true }
);
// مهم تفهم الحتة دي اللي لما بتشيل الاي دي الريفيوز مش بيرجع
reviewSchema.pre(/^find/, function (next) {
    
    this.populate({ path: 'user', select: 'name' })
        .populate({ path: 'product', select: 'title' })
        // .populate({ path: 'product', select: 'title -_id' })
    next()
})
 module.exports= mongoose.model('Review',reviewSchema)
