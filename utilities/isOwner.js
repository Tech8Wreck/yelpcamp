const Campground = require('../models/campground')
const Review = require('../models/reviews')
const catchAsync = require('./catchAsync');



const isOwner = catchAsync(async (req, res, next) => {

    const { id } = req.params;
    const found = await Campground.findById({ _id: id })
    // console.log(found.author)
    // console.log(req.user._id)
    const ownerId = req.user._id
    if(ownerId.toString() != found.author.toString()) {
        req.flash('error', 'You are not the owner')
        return res.redirect(`/campgrounds/${found._id}`)
    }
    next()
})


const reviewOwner = catchAsync(async (req, res, next) => {

    const { reviewId, id } = req.params;
    const found = await Review.findById({ _id: reviewId })
    // console.log(found.author)
    // console.log(req.user._id)
    const ownerId = req.user._id
    // console.log(ownerId, found.author._id)
    if(ownerId.toString() != found.author._id.toString()) {
        req.flash('error', 'You are not the owner')
        return res.redirect(`/campgrounds/${id}`)
}
    next()
})

module.exports = isOwner;
module.exports = reviewOwner;