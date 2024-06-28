

// const calcTotalCartPrice = (cart) => {
//     let totalPrice = 0;
//     cart.cartItems.forEach((item) => {
//       totalPrice += item.quantity * item.price;
//     });
//     cart.totalCartPrice = totalPrice;
//     cart.totalPriceAfterDiscount = undefined;
//     return totalPrice;
//   };
  
//   // @desc    Add product to  cart
//   // @route   POST /api/v1/cart
//   // @access  Private/User
//   exports.addProductToCart = async (req, res, next) => {
//     const { productId, color } = req.body;
//     const product = await Product.findById(productId);
  
//     // 1) Get Cart for logged user
//     let cart = await Cart.findOne({ user: req.currentuser._id });
  
//     if (!cart) {
//       // create cart fot logged user with product
//       cart = await Cart.create({
//         user: req.currentuser._id,
//         cartItems: [{ product: productId, color, price: product.price }],
//       });
//     } else {
//       // product exist in cart, update product quantity
//       const productIndex = cart.cartItems.findIndex(
//         (item) => item.product.toString() === productId && item.color === color
//       );
  
//       if (productIndex > -1) {
//         const cartItem = cart.cartItems[productIndex];
//         cartItem.quantity += 1;
  
//         cart.cartItems[productIndex] = cartItem;
//       } else {
//         // product not exist in cart,  push product to cartItems array
//         cart.cartItems.push({ product: productId, color, price: product.price });
//       }
//     }
  
//     // Calculate total cart price
//     calcTotalCartPrice(cart);
//     await cart.save();
  
//     res.status(200).json({
//       status: 'success',
//       message: 'Product added to cart successfully',
//       numOfCartItems: cart.cartItems.length,
//       data: cart,
//     });
// }
const totalpri=(cart)=>{
  let totalprice=0
  cart.cartItems.forEach(item => totalprice += item.price * item.quantity)
  cart.totalCartPrice = totalprice
}  
const cartModel = require('../models/cartModel')
const coupons = require('../models/couponModel')
const productModel = require('../models/productModel')

exports.addProductToCart = async(req, res) => {
try{  const { productId, color } = req.body
  const product = await productModel.findById(productId)
  if (!product) {
    return res.json("there is no product")
  }
    // find document user
  let cart = await cartModel.findOne({ user: req.currentuser._id })
  if (!cart) {
    cart =await cartModel.create({  user: req.currentuser._id, cartItems:[{product:productId, color:color, price:product.price}]})
  }
  else {
    const productIndex = cart.cartItems.findIndex(item => item.product == productId && item.color == color) //1
    if (productIndex > -1) {
      let cartItem = cart.cartItems[productIndex]
      cartItem.quantity+=1
    }
    else{cart.cartItems.push({product:productId, color:color, price:product.price})}

  }
  totalpri(cart)
  await cart.save(); res.status(200).json({ status : "success",length: cart.cartItems.length ,data: cart });
}
  catch (err) { res.status(500).json({ status: "fail", error: err }); }
}

exports.getProductToCart = async(req, res) => {
try{ 
  let cart = await cartModel.findOne({ user: req.currentuser._id })
  if (!cart) {
    return res.json({ message:"the cart is empty"})
  }
res.status(200).json({ status : "success",length: cart.cartItems.length ,data: cart });
}
  catch (err) { res.status(500).json({ status: "fail", error: err }); }
}

exports.deleteProductfromCart = async(req, res) => {
try{ 
  let cart = await cartModel.findOneAndUpdate ({ user: req.currentuser._id },{$pull :{cartItems:{_id:req.params.itemId}} },{new:true});
  if (!cart) {
    return res.json({ message:"this item is not exist in the cart "})
  }
  totalpri(cart)
  await cart.save()
res.status(200).json({ status : "success",length: cart.cartItems.length ,data: cart });
}
  catch (err) { res.status(500).json({ status: "fail", error: err }); }
}
exports.clearAllProductfromCart = async(req, res) => {
try{ 
  let cart = await cartModel.findOneAndDelete ({ user: req.currentuser._id });
  if (!cart) {
    return res.json({ message:"this cart is not exist  "})
  }
res.status(200).json({ status : "success",data: null });
}
  catch (err) { res.status(500).json({ status: "fail", error: err }); }
}

exports.updateQuantity = async(req, res) => {
  try { 
  let {quantity}=req.body;
  let cart = await cartModel.findOne({ user: req.currentuser._id });
  if (!cart) {
    return res.json({ message:"this cart is not exist  "})
  }
  const Cart = cart.cartItems.findIndex(item => item._id.toString() === req.params.itemId);
  // const Cart = cart.cartItems.findIndex(item => item._id == req.params.itemId);
  if (Cart > -1) {
   let index = cart.cartItems[Cart] 
    index.quantity = quantity
    cart.cartItems[Cart]=index
  }
  totalpri(cart)
  await cart.save(); res.status(200).json({ status : "success",length: cart.cartItems.length ,data: cart });
}
  catch (err) { res.status(500).json({ status: "fail", error: err }); }
}

exports.totalPriceAfterDiscount = async(req, res) => {
 try{ const { coupon } = req.body
  const Coupon= await  coupons.findOne({name: coupon, expire: {$gt: Date.now()}})
  if (!Coupon) {
    return res.json("Coupon invalid or expired")
  }
  const cart =await  cartModel.findOne({ user: req.currentuser._id })
  if (!cart) {
    return res.json("there is no Cart")
  }
   cart.totalPriceAfterDiscount = (cart.totalCartPrice - (cart.totalCartPrice * Coupon.discount) / 100).toFixed(2)
   await cart.save()
   res.status(200).json({ status: "success", length: cart.cartItems.length, data: cart });
 }
catch (err) { res.status(500).json({ status: "fail", error: err }); }
}







