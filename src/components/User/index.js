const { Types } = require('mongoose');
const UserService = require('./service');
const UserValidation = require('./validation');
const ValidationError = require('../../error/ValidationError');

/**
 * @function
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 * @returns {Promise < void >}
 */
async function findAll(req, res, next) {
    try {
        res.status(200).render('index', {
            token: req.csrfToken(),
            users: await UserService.findAll(),
        });
    } catch (error) {
        res.status(500).json({
            error: error.message,
            details: null,
        });

        next(error);
    }
}

/** Render page for a new user form */
async function tagAddPage(req, res, next) {
    try {
        res.render('add', {
            token: req.csrfToken(),
            error: null,
        });
    } catch (error) {
        res.status(500).json({
            error: error.message,
            details: null,
        });

        next(error);
    }
}

/**
 * @function
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 * @returns {Promise < void >}
 */
async function addUser(req, res, next) {
    try {
        const { error } = UserValidation.create(req.body);

        if (error) {
            throw new ValidationError(error.details);
        }

        await UserService.create(req.body);

        return res.status(300).redirect('/v1/users');
    } catch (error) {
        if (error instanceof ValidationError) {
            return res.status(422).render('add', {
                token: req.csrfToken(),
                error: error.message[0].message,
            });
        }

        res.status(500).json({
            message: error.name,
            details: error.message,
        });

        return next(error);
    }
}

/** render "upadate" page with default params at input fields */
async function tagUpdate(req, res, next) {
    try {
        const { error } = UserValidation.validateId(req.params);

        if (error) {
            throw new ValidationError(error.details);
        }

        return res.status(200).render('update', {
            token: req.csrfToken(),
            user: await UserService.findById(req.params.id),
            error: null,
        });
    } catch (error) {
        if (error instanceof ValidationError) {
            return res.status(422).json({
                error: error.name,
                details: error.message,
            });
        }

        res.status(500).json({
            message: error.name,
            details: error.message,
        });

        return next(error);
    }
}

/**
 * @function
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 * @returns {Promise<void>}
 */
async function updateById(req, res, next) {
    try {
        const { error } = UserValidation.updateById(req.body);

        if (error) {
            throw new ValidationError(error.details);
        }

        if (!Types.ObjectId.isValid(req.params.id)) {
            throw new ValidationError('Invalid ID');
        }

        await UserService.updateById(req.params.id, req.body);

        return res.status(300).redirect('/v1/users');
    } catch (error) {
        if (error instanceof ValidationError) {
            return res.status(422).render('update', {
                token: req.csrfToken(),
                user: req.body,
                error: error.message[0].message,
            });
        }

        res.status(500).json({
            message: error.name,
            details: error.message,
        });

        return next(error);
    }
}

/**
 * @function
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 * @returns {Promise<void>}
 */
async function deleteById(req, res, next) {
    try {
        const { error } = UserValidation.validateId(req.params);

        if (error) {
            throw new ValidationError(error.details);
        }

        await UserService.deleteById(req.params.id);

        return res.status(300).redirect('/v1/users');
    } catch (error) {
        if (error instanceof ValidationError) {
            return res.status(422).json({
                message: error.name,
                details: error.message,
            });
        }

        res.status(500).json({
            message: error.name,
            details: error.message,
        });

        return next(error);
    }
}

module.exports = {
    findAll,
    tagAddPage,
    tagUpdate,
    addUser,
    updateById,
    deleteById,
};
