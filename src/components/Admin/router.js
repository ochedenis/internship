const { Router } = require('express');
const AdminComponent = require('../Admin');
const PassportService = require('../authentication/passport-service');

/**
 * Express router to mount user related functions on.
 * @type {Express.Router}
 * @const
 */
const router = Router();

/* tag register page */
router.get('/register', PassportService.checkNotAuth, AdminComponent.tagRegisterPage);


/* add new admin to db */
router.post('/register', PassportService.checkNotAuth, AdminComponent.addAdmin);

/* tag login page */
router.get('/login', PassportService.checkNotAuth, AdminComponent.tagLoginPage);

/* authorizes admin */
router.post('/login', PassportService.checkNotAuth, PassportService.passport.authenticate('local', {
  successRedirect: '/v1/users',
  failureRedirect: '/v1/admins/login',
  failureFlash: true,
}));

/* loguot admin */
router.delete('/logout', PassportService.checkAuth, AdminComponent.logout);

/* tag page for delete admin */
router.get('/delete', AdminComponent.tagDeletePage);

/* delete admin from db */
router.delete('/delete', AdminComponent.deleteAdmin);

module.exports = router;
