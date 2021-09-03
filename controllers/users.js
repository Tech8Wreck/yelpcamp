const User = require('../models/user')
const passport = require('passport')



module.exports.registerUserFrom = (req, res) => {
    res.render('users/register')
}


module.exports.registerUser = async (req, res, next) => {
    try {
        const { email, password, username } = req.body;
        const user = new User({ username: username, email: email })
        const registeredUser = await User.register(user, password)
        req.login(registeredUser, err => {
            if (err) return next(err);
            req.flash('success', 'welcome to Yelp-Camp')
            res.redirect('/campgrounds')
        })

    } catch (e) {
        req.flash('error', e.message)
        res.redirect('/register')
    }
}


module.exports.getLoginForm = (req, res) => {
    res.render('users/login')
}


module.exports.loginUser = (req, res) => {
    const reutrnLink = req.session.returnLink || '/campgrounds'
    req.flash('success', 'Welcome back')
    delete req.session.returnLink;
    res.redirect(reutrnLink)
}

module.exports.logoutUser = (req, res) => {
    req.flash('success', 'Goodbye')
    req.logout()

    res.redirect('/campgrounds')
}