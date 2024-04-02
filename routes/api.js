const express=require('express')
const router= express.Router();
const User = require('../models/user');
const {isLogedIn}=require('../middleware')

router.post('/product/:id/like', isLogedIn,async(req,res)=>{
const id=req.params.id;
const user=req.user;
const isliked =user.WishList.includes(id);
    if(isliked)
    {
        await User.findByIdAndUpdate(req.user._id,{$pull :{ WishList:id}})
    }
    else
    {
        await User.findByIdAndUpdate(req.user._id,{$addToSet :{ WishList:id}})
    }
})
module.exports = router;