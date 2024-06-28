const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true,
    },
    cartItems: [
        {
            product: {
              type: mongoose.Schema.ObjectId,
              ref: 'field_Product'
            }
        ,   quantity: Number,
            color: String,
            price: Number,
            }
    ],

    taxPrice: {
      type: Number,
      default: 0,
    },
    shippingPrice: {
      type: Number,
      default: 0,
    },
    totalOrderPrice: { 
      type: Number,
    },
    paymentMethodType: {
      type: String,
      enum: ['card', 'cash'],
      default: 'cash',
    },
    isPaid: {
      type: Boolean,
      default: false,
    },
    paidAt: Date,
    isDelivered: {
      type: Boolean,
      default: false,
    },
    deliveredAt: Date,
  },
  { timestamps: true }
);

orderSchema.pre(/^find/, function (next) {
  this.populate({ path: "user", select: "name email" }).populate({ path: "cartItems.product", select:' imageCover title' })
  next()

})

module.exports = mongoose.model('Order', orderSchema);
