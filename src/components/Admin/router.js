const { Router } = require('express');
const AdminComponent = require('../Admin');
const PassportService = require('../authentication/passport-service');

/**
 * Express router to mount user related functions on.
 * @type {Express.Router}
 * @const
 */
const router = Router();

/**

 */
router.get('/register', PassportService.checkNotAuth, AdminComponent.tagRegisterPage);


/**

 */
router.post('/register', PassportService.checkNotAuth, AdminComponent.addAdmin);

/**

 */
router.get('/login', PassportService.checkNotAuth, AdminComponent.tagLoginPage);

/**

 */
router.post('/login', PassportService.checkNotAuth, PassportService.passport.authenticate('local', {
  successRedirect: '/v1/users',
  failureRedirect: '/v1/admins/login',
  failureFlash: true
}));

/**

*/
router.delete('/logout', PassportService.checkAuth, AdminComponent.logout);

module.exports = router;
