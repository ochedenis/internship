const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const AdminService = require('../Admin/service');

// passport configuration
passport.use(new LocalStrategy({ usernameField: 'email' }, authAdmin));
passport.serializeUser((user, done) => {
  return done(null, user._id); 
});
passport.deserializeUser((id, done) => {
  return done(null, AdminService.findById(id)); 
})

async function authAdmin(email, password, done) {
    const user = await AdminService.findOne(email); 

    if (!user) {
      return done(null, false, { message: 'Inavalid password or email address!' });
    }

    try {
      if (await bcrypt.compare(password, user.password)) {
        return done(null, user);
      } else {
        return done(null, false, { message: 'Inavalid password or email address!' });
      }
    } catch (error) {
      return done(error);
    }
}


function checkAuth(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }

  return res.redirect('/v1/admins/login');
}

function checkNotAuth(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect('/v1/users');
  }
  return next();
}

module.exports = {
  passport,
  checkAuth,
  checkNotAuth,
}