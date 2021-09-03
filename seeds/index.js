const mongoose = require('mongoose');
const Campground = require('../models/campground');
const cities = require('./cities');
const {places,descriptors} = require('./seedsHelpers');




mongoose.connect('mongodb://localhost:27017/yelp-camp',{
useNewUrlParser: true, 
useUnifiedTopology: true,
useCreateIndex: true
})
.then(() => {
    console.log("connection open");
})
.catch(err => {
    console.log("oh error!!!!!");
    console.log(err);
})



const seedDB = async ()=>{
    await Campground.deleteMany({});
    // const c = new Campground({title: 'NicoS'})
    // await c.save();


    for(let i = 0;i<=50;i++){
        let rand = Math.floor(Math.random() * 1000);
        let arrayy = Math.floor(Math.random() * places.length)
const newcamp = new Campground({
    author: '6127c4e3546b9c2994e0f850',
    title: `${places[arrayy]} ${descriptors[arrayy]}`,
    location: `${cities[rand].city}, ${cities[rand].state}`,
    geometry: { type: 'Point', coordinates: [ `${cities[rand].longitude}`, `${cities[rand].latitude}` ] },
    images: [{url:`https://source.unsplash.com/collection/483251`}],
    description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Minima doloremque dicta, facere minus placeat laborum totam, officia asperiores consequuntur iste impedit porro. ',
    price: `${Math.floor(Math.random() * 100)}`
})

await newcamp.save();
    }
}


seedDB();