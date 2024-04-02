const mongoose = require('mongoose');
const User = require('./user');

const reviewSchema = new mongoose.Schema({
    rating: {
        type: Number,
        min: 0,
        max: 5,
    },
    comment: {
        type: String,
        trim: true,
    },
    author:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    }
},
{timestamps:true});


const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;