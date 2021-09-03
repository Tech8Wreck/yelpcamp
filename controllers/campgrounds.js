const Campground = require('../models/campground');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding')
const mapToken = process.env.MAPBOX_TOKEN

const geocoder = mbxGeocoding({ accessToken: mapToken})

module.exports.index = async (req, res) => {
    const camps = await Campground.find({ });
    res.render('home', { camps });
}


module.exports.renderNewForm = (req, res) => {

    res.render('new');

}

module.exports.showCampground = async (req, res) => {
    const { id } = req.params;

    const showCamp = await Campground.findById({ _id: id }).populate({
        path: 'reviews', 
        populate: {
            path: 'author'
        }
    }).populate('author')
    // console.log(showCamp)
    res.render('show', { showCamp })
}

module.exports.getEditForm = async (req, res) => {
    const { id } = req.params;
    const editCamp = await Campground.findById({ _id: id })
    res.render('edit', { editCamp })
}


module.exports.createNewCampground = async (req, res) => {
  const geoData =  await geocoder.forwardGeocode({
        query: req.body.campground.location,
        limit: 1
    }).send()
    // console.log(geoData.body.features[0].geometry.coordinates)
    // res.send('geoData!!!!!')
// console.log(req.files)
    const newcamp = new Campground(req.body.campground);
    newcamp.images = req.files.map(f => ({url: f.path, filename: f.filename}))
    newcamp.author = req.user._id;
    newcamp.geometry = geoData.body.features[0].geometry
    await newcamp.save()
    console.log(newcamp)
    req.flash('success', 'Successfully made a new campground!')
    res.redirect(`/campgrounds/${newcamp._id}`)
}

module.exports.editCampground = async (req, res) => {
    // console.log(req.user)
    // console.log(req.body.campground)
    const { id } = req.params;
    const { title, location, price } = req.body.campground;
    const newCamp = await Campground.findByIdAndUpdate({_id: id }, { title: title, location: location, price: price }, { new: true })
    // newCamp.images = req.files.map(f => ({url: f.path || newCamp.images.url, filename: f.filename || newCamp.images.filename}))
    await newCamp.save()
    // console.log(newCamp);
    req.flash('success', 'Camp Edited Successfully')
    res.redirect(`/campgrounds/${id}`)
}

module.exports.deleteCampground = async (req, res) => {

    const { id } = req.params;
    await Campground.findOneAndDelete({ _id: id });
    req.flash('success', 'Camp Deleted Successfully')
    res.redirect('/campgrounds');
}