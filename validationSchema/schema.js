const Joi = require('joi');
const ExpressError = require('../utilities/expressError');


const campgroundSchema = Joi.object({
    campground: Joi.object({
        title: Joi.string().required(),
        price: Joi.number().required().min(0),
        // image: Joi.string().required(),
        description: Joi.string().required(),
        location: Joi.string().required()
    })
}).required();

const validateCampground = (req, res, next) =>{
    const budy = req.body;
    // console.log(budy)
    const {error} = campgroundSchema.validate(budy);
    // console.log(result)
    if(error){
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    }else{
        next()
    }
}

const reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().required(),
        body: Joi.string().required()
    })
})

const validateReview = (req, res, next) =>{
    const {error} = reviewSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    }else{
        next()
    }
}

module.exports = {campgroundSchema, validateCampground, reviewSchema, validateReview};

