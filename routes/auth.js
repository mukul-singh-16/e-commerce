const express = require('express');
const router = express.Router();
const User = require('../models/user');
const passport = require('passport');


router.get('/register', (req, res) => {
    res.render('auth/signup');
});

router.post('/register', async (req, res) => {
    
    try {
        const { username, password, email, role } = req.body;
        const user = new User({role, username, email });
        const newUser = await User.register( user, password);

        req.login(newUser, function(err) {
            if (err){
                return next(err);
            }

            req.flash('success', 'Welcome , You are Registered Successfully');

            return res.redirect('/products');
        });
    }
    catch (e) {
        req.flash('error', e.message);
        res.redirect('/register');
    }
});


router.get('/login', (req, res) => {
    // console.log("get login wala middleware");
   
        // console.log(req.session);
    
    res.render('auth/login');
});






router.post('/login', passport.authenticate('local', { 
        failureRedirect: '/login',
        failureFlash: true
    }), 
    (req, res) => {
        req.flash('success', `Welcome Back  ${req.user.username} Again!!`);
        console.log('Logged In Successfully!');
        let redirecturl = ('/products');
        try{
             redirecturl = (currenturl||'/products');
        }
        catch(e)
        {
        redirecturl = ('/products');
        }

        if(redirecturl && redirecturl.indexOf('user')!==-1)
        {
            redirecturl = ('/products');
        }
        
        if(redirecturl && redirecturl.indexOf('review')!==-1)
        {
            redirecturl=redirecturl.split('/');
            redirecturl.pop();
            redirecturl=redirecturl.join('/');   
        }
        // delete req.session.redirecturl;
    
       
        
        res.redirect(redirecturl);
    }
);

router.get('/logout', (req, res) => {
    req.logout(function(err) {
        if (err) { return next(err); }
        req.flash('success', 'GoodBye!!');
        res.redirect('/products');
      });
  
});





module.exports = router;