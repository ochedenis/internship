const { Router } = require('express');
const csrf = require('csurf');
const UserComponent = require('../User');
const PassportService = require('../authentication/passport-service');

/** initializes csrf protection */
const protection = csrf();

/**
 * Express router to mount user related functions on.
 * @type {Express.Router}
 * @const
 */
const router = Router();

/**
 * Route serving list of users.
 * @name /v1/users
 * @function
 * @inner
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware.
 */
router.get('/', [PassportService.checkAuth, protection], UserComponent.findAll);  //////  

/**
 * Render page for a new user form
 * @name /v1/users/add
 * @function
 * @inner
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware
 */
router.get('/add', [PassportService.checkAuth, protection], UserComponent.tagAddPage);


/**
 * Route serving a new user
 * @name /v1/users/add
 * @function
 * @inner
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware
 */
router.post('/add', [PassportService.checkAuth, protection], UserComponent.addUser);

/**
 * Render page for update a user.
 * @name /v1/users/update/:id
 * @function
 * @inner
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware
 */
router.get('/update/:id', [PassportService.checkAuth, protection], UserComponent.tagUpdate);

/**
 * Route for update a user
 * @name /v1/users/update/:id
 * @function
 * @inner
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware
 */
router.put('/update/:id', [PassportService.checkAuth, protection], UserComponent.updateById);

/**
 * Route for delete a user
 * @name /v1/users/delete/:id
 * @function
 * @inner
 * @param {string} path -Express path
 * @param {callback} middleware - Express middleware
 */
router.delete('/delete/:id', [PassportService.checkAuth, protection], UserComponent.deleteById);

module.exports = router;
