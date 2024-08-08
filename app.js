const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');

mongoose.connect("mongodb+srv://guptarajat2206:JrOxH5QFgzqNCelS@ecommerce.ghxjk8p.mongodb.net/?retryWrites=true&w=majority&appName=ecommerce")
    .then(() => console.log('DB Connected'))
    .catch((err) => console.log(err));

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));



const sessionConfig = {
    secret: 'weneedsomebettersecret',
    resave: false,
    saveUninitialized: true,
    cookie:{
        httpOnly: true,
        // expires: Date.now() + 1000* 60 * 60 * 24 * 7,
        maxAge:1000* 60 * 60 * 24 * 7 * 1
    }
}  


app.use(session(sessionConfig));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());


//passport ke ander passport-locol-mongoose ka function bhej rha hu iske jaga apna be bhej sekta hu
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


//passport  check krega username and password using authenticate method provided by the passport-local-mongoose package
passport.use(new LocalStrategy(User.authenticate())); 


app.use((req, res, next) => {
    
    res.locals.currenturl='/products';
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');

    // console.log(res.locals.currentUser);
    next();
})

// console.log("appjs wala middleware");
// console.log(session);

// Routes

app.get('/',(req,res)=>{
    res.json({msg:"hello ji"})
})
const productRoutes = require('./routes/product');
const reviewRoutes = require('./routes/review');
const authRouts = require('./routes/auth');
const api=require('./routes/api');
const cart=require('./routes/cart');

app.use(authRouts);
app.use(productRoutes);
app.use(reviewRoutes);
app.use(api);
app.use(cart);


const port = 5000;

app.listen(port, () => {
    console.log(`server running at port ${port}`);
});