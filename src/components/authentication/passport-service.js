const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const AdminService = require('../Admin/service');

/* admin authentication during authorization */
async function authAdmin(email, password, done) {
    const user = await AdminService.findOne(email); 

    if (!user) {
      return done(null, false, { message: 'Inavalid password or email address!' });
    }

    try {
      if (await bcrypt.compare(password, user.password)) {
        return done(null, user);
      } 

      return done(null, false, { message: 'Inavalid password or email address!' });
    } catch (error) {
      return done(error);
    }
}

// passport configuration
passport.use(new LocalStrategy({ usernameField: 'email' }, authAdmin));
passport.serializeUser((user, done) => done(null, user._id));
passport.deserializeUser((id, done) => done(null, AdminService.findById(id)));

/* checks if admin is authenticated */
function checkAuth(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }

  return res.redirect('/v1/admins/login');
}

/* 
* checks if admin is not authenticated,
* redirect on 'users' page from 'login' and 'register' routes
 */
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
};
