const express = require('express');
const router = express.Router();
const { isLogedIn } = require('../middleware');
const Product = require('../models/product');
const User = require('../models/user');


router.get('/user/cart',isLogedIn, async(req, res) => {
    
    try{
    console.log("show carts")
    const user = await User.findById(req.user._id).populate('cart');
    // console.log(user)
    const totalAmount = user.cart.reduce((sum, curr) => sum + curr.price, 0);

    res.render('cart/cart', { user ,totalAmount});
    }
    catch(e)
    {
        res.send(e);
    }
})


router.post('/user/:productid/add',isLogedIn, async(req, res) => {
    
    const { productid } = req.params;
    const userid = req.user._id;
    const product = await Product.findById(productid);
    const user = await User.findById(userid);
    
    user.cart.push(productid);

    await user.save();
    console.log("add to cart")

    res.redirect(`/products/${productid}`);
})








module.exports = router;