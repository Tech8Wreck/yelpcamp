const express = require('express')
const router = express.Router()
const Campground = require('../models/campground');
const catchAsync = require('../utilities/catchAsync');
const ExpressError = require('../utilities/expressError');
const { campgroundSchema, validateCampground } = require('../validationSchema/schema');
const isValidated = require('../utilities/isValidated')
const valid = require('../utilities/isOwner');
const controllers = require('../controllers/campgrounds')

const {storage} = require('../cloudinary')
const multer = require('multer')
const upload = multer({ storage })


router.get('/index', catchAsync(controllers.indexes))
router.get('', catchAsync(controllers.index))

router.route('/new')
.get(isValidated, controllers.renderNewForm)
.post( isValidated, upload.array('image'), validateCampground, catchAsync(controllers.createNewCampground))
// .post(upload.single('image'), (req, res) =>{
//     console.log(req.body, req.file)
//     res.send('it worked')
// })


router.route('/:id')
    .delete( isValidated, catchAsync(controllers.deleteCampground))
    .get( catchAsync(controllers.showCampground))


router.route('/:id/edit')
    .get( isValidated, catchAsync(controllers.getEditForm))
    .put( isValidated, upload.array('image'),  validateCampground, catchAsync(controllers.editCampground))



module.exports = router;