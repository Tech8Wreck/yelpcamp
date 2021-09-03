
const isValidated = (req, res, next) =>{
    // console.log('user: ', req.user.username) error
    req.session.returnLink = req.originalUrl
    // console.log(req.path, req.originalUrl)
    if(!req.isAuthenticated()){
        req.flash('error', 'You are not logged in..')
        return res.redirect('/login')
    }
    next()
}


module.exports = isValidated;