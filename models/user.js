const { string } = require('joi');
const mongoose = require('mongoose');
const passportLocolMongoose = require('passport-local-mongoose');
const product = require('./product');
const userSchema = new mongoose.Schema({
    email:String,
    role:{
        type:String,
        default:'buyer'
    },
    WishList:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:product
    }],
    cart:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:product
    }]
})

userSchema.plugin(passportLocolMongoose);


const User=mongoose.model("User",userSchema);

module.exports = User;