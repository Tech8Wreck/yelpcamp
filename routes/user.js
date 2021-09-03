const User = require('../models/user')
const express = require('express')
const router = express.Router();
const catchAsync = require('../utilities/catchAsync');
const passport = require('passport')
const user = require('../controllers/users')


router.route('/register')
    .get( user.registerUserFrom)
    .post( catchAsync(user.registerUser))



router.route('/login')
    .get( user.getLoginForm)
    .post( passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), user.loginUser)


    
router.get('/logout', user.logoutUser)





module.exports = router;