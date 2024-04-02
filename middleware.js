const { productSchema,reviewSchema } = require('./schemas');
const productmodel=require('./models/product')


// Middleware to set returnUrl
module.exports.isLogedIn = (req, res, next) => {
  

    if(req.xhr && !req.isAuthenticated())
    {
        if(currenturl='/products')
        req.flash('error','you need to login first');
        return res.status(401).json({msg:'you need to login first'});
    }
     
    currenturl = req.originalUrl;
    
    // console.log("islogin wala middleware");
    // console.log(req.session);
    
    if(!req.isAuthenticated()) {
        req.flash('error','you need to login first');
        return res.redirect('/login');
    }

    next();
};



module.exports.isseller= (req,res,next)=>{
    if(req.user.role && req.user.role!=('seller'))
    {
        res.render('error', { err: 'You are not a seller' });
        // return res.redirect('/products')
    }
    next()
    
}


module.exports.validateProduct = (req, res, next) => {
    
    const { name, img, desc, price } = req.body;
    const { error} = productSchema.validate({ name, img, price, desc });

    if (error) {
        const msg = error.details.map((err)=>err.message).join(',')
        return res.render('error', { err: msg });
    }

    next();

}


module.exports.validateReview = (req,res,next) => {
    
    const { rating, comment } = req.body;
    const { error } = reviewSchema.validate({ rating, comment });

    if (error) {
        const msg = error.details.map((err)=>err.message).join(',')
        // console.log(msg);
        return res.render('error', { err: msg });
    }
    next();
}


module.exports.isValidProductAuthor = async (req,res,next)=>{
    const { id } = req.params;
    const product = await productmodel.findById(id);

    if(! product.author.equals(req.user._id))
    return res.render('error',{err:'you cannot delete any other user products'})
    next();
}


