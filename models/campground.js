const mongoose = require('mongoose');
const reviews = require('./reviews');
const Schema = mongoose.Schema;


const CampgroundSchema = new Schema({
    title: String,
    images:[
        {
            url: String,
            filename: String
        }
    ],
    price: Number,
    description: String,
    location: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [
        {
            type: Schema.Types.ObjectId, 
            ref: 'Review'
        }
    ],
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    }
})

// this is to delete the reviews when you delete an campground
CampgroundSchema.post('findOneAndDelete', async doc =>{
    if(doc){
        await reviews.deleteMany({_id: {$in: doc.reviews}})
    }
})

module.exports = mongoose.model('Campground', CampgroundSchema);