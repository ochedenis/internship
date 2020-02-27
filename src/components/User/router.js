const { Router } = require('express');
const UserComponent = require('../User');

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
router.get('/', UserComponent.findAll);

/**
 * Render page for a new user form
 * @name /v1/users/add
 * @function
 * @inner
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware
 */
router.get('/add', (req, res, next) => {
	try {
		res.render('add');
	} catch (error) {
		res.status(500).json({
            error: error.message,
            details: null,
        });

        next(error);
	}
});

/**
 * Route serving a new user
 * @name /v1/users/add
 * @function
 * @inner
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware
 */
router.post('/add', UserComponent.create);

/**
 * Render page for update a user.
 * @name /v1/users/update/:id
 * @function
 * @inner
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware
 */
router.get('/update/:id', UserComponent.renderUpdate);

/**
 * Route for update a user
 * @name /v1/users/update/:id
 * @function
 * @inner
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware
 */
router.post('/update/:id', UserComponent.updateById);

/**
 * Route for delete a user
 * @name /v1/users/delete/:id
 * @function
 * @inner
 * @param {string} path -Express path
 * @param {callback} middleware - Express middleware
 */
router.get('/delete/:id', UserComponent.deleteById);

module.exports = router;
