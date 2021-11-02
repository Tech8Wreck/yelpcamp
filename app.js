if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}






const express = require('express');
const ejs = require('ejs');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const morgan = require('morgan');
const ejsMate = require('ejs-mate');
const ExpressError = require('./utilities/expressError');
const Joi = require('joi');
const campgrounds = require('./routes/campgrounds')
const reviews = require('./routes/reviews')
const users = require('./routes/user')
const session = require('express-session')
const flash = require('connect-flash')
const passport = require('passport')
const localStrategy = require('passport-local')
const User = require('./models/user')
const database = process.env.dbURL

// 'mongodb://localhost:27017/yelp-camp'
mongoose.connect(database, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false 
})
    .then(() => {
        console.log("connection open");
    })
    .catch(err => {
        console.log("oh error!!!!!");
        console.log(err);
    })



app.engine('ejs', ejsMate)
morgan('tiny')
app.use(methodOverride('_method'));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname,'public')))
app.use(session({
    secret: 'keyboardcat',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
  }))
  app.use(flash())



app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()))

passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())



app.use((req, res, next) =>{
    res.locals.CurrentUser = req.user;
    
    res.locals.message = req.flash('success')
    res.locals.messageError = req.flash('error')
    next()
})


app.use('', campgrounds)
app.use('', reviews)
app.use('', users)



app.all('*',(err, req, next) =>{
next(new ExpressError('not found',404))
})

app.use((err, req, res, next) => {
    const {message = 'something went wrong', statusCode = 500} = err;
res.status(statusCode).send(message);
})



const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log('server started');
})