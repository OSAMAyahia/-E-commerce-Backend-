const Order = require('../models/orderModel');
const Cart = require('../models/cartModel');
const Product = require('../models/productModel');

exports.CreateCashOrder = async (req, res) => {
  try{  // call product
    let taxPrice=0
       let shippingPrice = 0
      const cart = await Cart.findById(req.params.id);
      
let totalOrderPrice= cart.totalPriceAfterDiscount? cart.totalPriceAfterDiscount:cart.totalCartPrice
      totalOrderPrice = totalOrderPrice + taxPrice + shippingPrice
      

    const order= await Order.create({user:req.currentuser._id,cartItems:cart.cartItems,totalOrderPrice :totalOrderPrice})

    // const product = Product.findById(cartItems.product)
    // const v=order.cartItems.quantity.Number()
    //     product.sold +=v
    //     product.quantity -=v
    //     await product.save()
 if (order){
   const bulkOption= cart.cartItems.map(item => ({
        updateOne: {
            filter: { _id: item.product },
       update: { $inc: { quantity: -item.quantity, sold: +item.quantity } }
     }
   }))
   
     await Product.bulkWrite(bulkOption)
 await Cart.findByIdAndDelete(req.params.id)
    }
      res.status(201).json({ status: 'success', data: order });
  }
  catch (err) {
      res.status(500).json({ status: "fail", error: err });
  console.log(err);}
}

exports.getallOrders = async (req, res) => {
  try { 
    let filter={}
    if (req.currentuser.role === "user") {
      filter={user:req.currentuser._id}
    }
    const order = await Order.find(filter)
    res.status(201).json({ length: order.length,status: 'success', data: order });
  }
  catch (err) {
      res.status(500).json({ status: "fail", error: err }, console.log(err));
  console.log(err);}
}

exports.getone = async (req, res) => {
  try { 
    const order = await Order.findById({_id:req.params.id})
    res.status(201).json({ length: order.length,status: 'success', data: order });}
  catch (err) {
    res.status(500).json({ status: "fail", error: err }, console.log(err));
  }
}
      
exports.updatedOrderPaid = async (req, res, next) => { 
  try {
    const order = await Order.findById(req.params.id)
    if (!order) { return res.status(404).json({ status: "fail", error: err }); }
    order.isPaid=true
    order.paidAt = Date.now()
    const d = await order.save()
    res.status(201).json({ length: order.length, status: 'success', data: d });
  }
  catch (err) {
      res.status(500).json({ status: "fail", error: err });
  console.log(err);}}

exports.updateddelivered = async (req, res, next) => { 
  try {
    const order = await Order.findById(req.params.id)
    if (!order) { return res.status(404).json({ status: "fail", error: err }); }
    order.isDelivered=true
    order.deliveredAt = Date.now()
    const d = await order.save()
    res.status(201).json({ length: order.length, status: 'success', data: d });
  }
  catch (err) {
      res.status(500).json({ status: "fail", error: err });
  console.log(err);}
}


const stripe = require('stripe')("sk_test_51POQODKaNDR38m23Gx6MusJXuuZEWq6Ems72SDPcLJoCQ9lPtj933uJSHqlVEWYeYif5CoJrRMktymlWKExoTcn1002KQT3Xi0");

// @desc    Get checkout session from stripe and send it as response
// @route   GET /api/v1/orders/checkout-session/cartId
// @access  Protected/User
exports.checkoutSession = async (req, res, next) => {
  try{// app settings
    let taxPrice=0
    let shippingPrice = 0
   const cart = await Cart.findById(req.params.id);
   if (!cart) { return res.status(404).json({ status: "fail",  }) }
let totalOrderPrice= cart.totalPriceAfterDiscount? cart.totalPriceAfterDiscount:cart.totalCartPrice
   totalOrderPrice = totalOrderPrice + taxPrice + shippingPrice
   

  // 3) Create stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'egp',
            product_data: {
              name: req.currentuser.name,
            },
            unit_amount: totalOrderPrice * 100,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${req.protocol}://${req.get('host')}/order`,
      cancel_url: `${req.protocol}://${req.get('host')}/Carts`,
      customer_email: req.currentuser.email,
      client_reference_id: req.params.id,
    })
    

  // 4) send session to response
    res.status(200).json({ status: 'success', session });
  }
  catch (err) {
    res.status(500).json({ status: "fail", error: err });
console.log(err);}
};




