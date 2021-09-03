const Review = require('../models/reviews')
const Campground = require('../models/campground');





module.exports.makeReview = async (req, res) =>{
   
    const { id } = req.params;
    const camp = await Campground.findById({ _id: id });
    const review = new Review(req.body.review);
    review.author = req.user._id
    camp.reviews.push(review);
    
    await review.save();
    await camp.save();
    // console.log(review)
    res.redirect(`/campgrounds/${id}`)
    }

    module.exports.deleteReview = async (req, res) =>{
        const { id, reviewId } = req.params;
        // console.log(req.params)
        await Review.findOneAndDelete({_id: reviewId})
        await Campground.findByIdAndUpdate({_id: id}, {$pull: {reviews: reviewId}})
        res.redirect(`/campgrounds/${id}`)
    }


    