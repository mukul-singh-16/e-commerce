const express = require('express');
const router = express.Router();
const Product = require('../models/product');
const Review = require('../models/review');
const {isLogedIn, validateReview } = require('../middleware');


router.post('/products/:productid/review',isLogedIn,validateReview,async(req, res) => {


    try {
        const { productid } = req.params;
        const { rating, comment } = req.body;

        const product = await Product.findById(productid);

        const author =req.user._id;

        const review = new Review({ rating, comment,author });

        // Average Rating Logic
        const newAverageRating = ((product.avgRating * product.reviews.length) + parseInt(rating)) / (product.reviews.length + 1);
        product.avgRating = parseFloat(newAverageRating.toFixed(1));

        product.reviews.push(review);

        await review.save();
        await product.save();

        req.flash('success', 'Added your review successfully!');
        res.redirect(`/products/${productid}`);
    }

    catch (e) {
        res.status(500).render('error', { err: e.message });
    }
    
});

router.delete('/product/:productId/review/:reviewId',async(req,res)=>{
    try {
        const { productId ,reviewId} = req.params;
        

        const product = await Product.findById(productId);
        console.log(product.reviews.length)

        const index = product.reviews.indexOf(reviewId);
        if (index > -1) { 
            await product.reviews.splice(index, 1); 
            product.save();
            await Review.findByIdAndDelete(reviewId);
          
          }
        //   console.log(product.reviews.length)
        res.redirect(`/products/${productId}`);
    }

    catch (e) {
        res.status(500).render('error', { err: e.message });
    }
})

router.patch('/product/:productId/review/:reviewId',async(req,res)=>{
    try {
        const { productId ,reviewId} = req.params;


        const comment="mst cheej hai";
        await Review.findByIdAndUpdate(reviewId,{comment,rating:5});
       
        res.redirect(`/products/${productId}`);
    }

    catch (e) {
        res.status(500).render('error', { err: e.message });
    }
})



module.exports = router;
