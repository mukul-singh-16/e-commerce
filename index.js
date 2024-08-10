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
const MongoStore = require('connect-mongo');
const User = require('./models/user');
const dotenv = require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('DB Connected'))
    .catch((err) => console.log(err));

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

const sessionConfig = {
    secret: process.env.SESSION_SECRET || 'weneedsomebettersecret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 7 // 1 week
    },
    store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URI,
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
};

app.use(session(sessionConfig));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

// Passport configuration
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
passport.use(new LocalStrategy(User.authenticate()));

// Middleware to set local variables
app.use((req, res, next) => {
    res.locals.currenturl = '/products';
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
});

// Routes
app.get('/', (req, res) => {
    res.send("hello ji");
});

// Uncomment and define your routes here
// const productRoutes = require('./routes/product');
// const reviewRoutes = require('./routes/review');
// const authRoutes = require('./routes/auth');
// const apiRoutes = require('./routes/api');
// const cartRoutes = require('./routes/cart');

// app.use(authRoutes);
// app.use(productRoutes);
// app.use(reviewRoutes);
// app.use(apiRoutes);
// app.use(cartRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    const { statusCode = 500, message = 'Something went wrong' } = err;
    res.status(statusCode).render('error', { err });
});

// Start server
const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Server running at port ${port}`);
});
