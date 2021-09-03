const express = require('express')
const router = express.Router()
// const router = express.Router({mergeParams: true})
const Campground = require('../models/campground');
const catchAsync = require('../utilities/catchAsync');
const ExpressError = require('../utilities/expressError');
const {campgroundSchema, reviewSchema, validateReview} = require('../validationSchema/schema');
const Review = require('../models/reviews')
const isValidated = require('../utilities/isValidated')
const reviewOwner = require('../utilities/isOwner')
const review = require('../controllers/reviews')
// const ExpressError = require('../utilities/expressError');


router.post('/campgrounds/:id/reviews',  isValidated, validateReview, catchAsync(review.makeReview)) 
    
    
router.delete('/campgrounds/:id/reviews/:reviewId', reviewOwner, isValidated, catchAsync(review.deleteReview))



module.exports = router;