if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}


console.log(process.env.SECRET)



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

// OR   OR  OR OR   OR          OR          OR          OR          OR

// const db = mongoose.connection;
// db.on('error', console.error.bind(console,'connection error:'));
// db.once('open',()=>{
//     console.log('database connected');
// })

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











// fake user testing passport

app.get('/fakeuser', async (req, res) =>{
    const user = new User({email: 'nico@gmail.com', username: 'nico'})
    const newUser = await User.register(user, 'chicken')
    res.send(newUser)
})




app.use('/campgrounds', campgrounds)
app.use('', reviews)
app.use('', users)
// Exported from the schema

// const campgroundSchema = Joi.object({
//     campground: Joi.object({
//         title: Joi.string().required(),
//         price: Joi.number().required().min(0),
//         image: Joi.string().required(),
//         description: Joi.string().required(),
//         location: Joi.string().required()
//     }).required()
// })

// const reviewSchema = Joi.object({
//     review: Joi.object({
//         rating: Joi.number().required(),
//         body: Joi.string().required()
//     }).required()
// })

// exported from the schema module

// validation  middleware

// const validateCampground = (req, res, next) =>{
//     const budy = req.body;
//     // console.log(budy)
//     const {error} = campgroundSchema.validate(budy);
//     // console.log(result)
//     if(error){
//         const msg = error.details.map(el => el.message).join(',')
//         throw new ExpressError(msg, 400)
//     }else{
//         next()
//     }
// }

// const validateReview = (req, res, next) =>{
//     const {error} = reviewSchema.validate(req.body);
//     if(error){
//         const msg = error.details.map(el => el.message).join(',')
//         throw new ExpressError(msg, 400)
//     }else{
//         next()
//     }
// }






















// app.use((err, req, res, next)=>{
// console.log('*********************************')
// console.log('************ERROR**************')
// console.log('********************************')
// console.log(res)
// })

app.all('*',(err, req, next) =>{
next(new ExpressError('not found',404))
})

app.use((err, req, res, next) => {
    const {message = 'something went wrong', statusCode = 500} = err;
res.status(statusCode).send(message);
})




app.listen(3000, () => {
    console.log('server started');
})