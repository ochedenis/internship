const AdminService = require('./service');
const AdminValidation = require('./validation');
const ValidationError = require('../../error/ValidationError');
const ServiceJWT = require('../authentication/JWT-service');
const UserService = require('../User/service');
const UserValidation = require('../User/validation');
const bcrypt = require('bcrypt');

/**

*/
async function registration(req, res, next) {
	try {
        const { error } = AdminValidation.validateRegister(req.body);

		if (error) {
            throw new ValidationError(error.details);
        }

        await AdminService.create(req.body);

        return res.status(200).json(await ServiceJWT.generateTokens(req.body.email));
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

/**

*/
async function login(req, res, next) {
	try {
        const { error } = AdminValidation.validateLogin(req.body);

		if (error) {
            throw new ValidationError(error.details);
        }

        const admin = await AdminService.findOne(req.body.email);

        if (!admin) {
        	return res.status(400).send('Inavalid password or email address!');
        }
        if (! await bcrypt.compare(req.body.password, admin.password)) {
        	return res.status(400).send('Inavalid password or email address!');
        }
        if (await ServiceJWT.checkTokenAvailability(admin.email)) {
        	return res.status(400).send('Admin with this email has already logged in!');
        }

        return res.status(200).json(await ServiceJWT.generateTokens(admin.email));
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

/**

*/
async function updateTokens(req, res, next) {
	try {
		const { error } = AdminValidation.validateToken(req.body);

		if (error) {
            throw new ValidationError(error.details);
        }

		const email = await ServiceJWT.checkRefreshToken(req.body.token);

		if (!email) {
			return res.status(400).send('Inavalid token!');
		}

        return res.status(200).json(await ServiceJWT.generateTokens(email));
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

/**

*/
async function logout(req, res, next) {
	try {
		const { error } = AdminValidation.validateLogout(req.body);

		if (error) {
            throw new ValidationError(error.details);
        }

        if(! await ServiceJWT.logout(req.body.email)) {
        	return res.status(400).send('No login with this email!');
        }

        return res.sendStatus(200);
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

/**
 * @function
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 * @returns {Promise < void >}
 */
async function findAll(req, res, next) {
    try {
        const users = await UserService.findAll();

        res.status(200).json({
            data: users,
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

        const user = await UserService.create(req.body);

        return res.status(200).json({
            data: user,
        });
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

        const updatedUser = await UserService.updateById(req.body.id, req.body);

        return res.status(200).json({
            data: updatedUser,
        });
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

/**
 * @function
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 * @returns {Promise<void>}
 */
async function deleteById(req, res, next) {
    try {
        const { error } = UserValidation.validateId(req.body);

        if (error) {
            throw new ValidationError(error.details);
        }

        const deletedUser = await UserService.deleteById(req.body.id);

        return res.status(200).json({
            data: deletedUser,
        });
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
	registration,
	login,
	updateTokens,
	logout,
    findAll,
    addUser,
    updateById,
    deleteById,
};