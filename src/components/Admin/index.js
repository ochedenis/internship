const AdminService = require('./service');
const AdminValidation = require('./validation');
const ValidationError = require('../../error/ValidationError');

/* tag register page */
async function tagRegisterPage(req, res, next) {
    try {
        res.status(200).render('register');
    } catch (error) {
        res.status(500).json({
            error: error.message,
            details: null,
        });

        next(error);
    }
}

/* add new admin to db */
async function addAdmin(req, res, next) {
    try {
        const { error } = AdminValidation.validateRegister(req.body);

        if (error) {
            throw new ValidationError(error.details);
        }

        await AdminService.create(req.body);

        return res.status(300).redirect('/v1/admins/login');
    } catch (error) {
        if (error instanceof ValidationError) {
            req.flash('error', error.message[0].message);

            return res.status(422).render('register');
        }

        res.status(500).json({
            message: error.name,
            details: error.message,
        });

        return next(error);
    }
}

/* tag login page  */
async function tagLoginPage(req, res, next) {
    try {
        res.status(200).render('login');
    } catch (error) {
        res.status(500).json({
            error: error.message,
            details: null,
        });

        next(error);
    }
}

/* ends passport session with current user */
function logout(req, res, next) {
    try {
        req.logOut();

        res.status(300).redirect('/v1/admins/login');
    } catch (error) {
        res.status(500).json({
            error: error.message,
            details: null,
        });

        next(error);
    }
}

/* tag delete page  */
async function tagDeletePage(req, res, next) {
    try {
        res.status(200).render('delete');
    } catch (error) {
        res.status(500).json({
            error: error.message,
            details: null,
        });

        next(error);
    }
}

/* ends passport session and delete admin from db */
async function deleteAdmin(req, res, next) {
        try {
        const { error } = AdminValidation.validateLogin(req.body);

        if (error) {
            throw new ValidationError(error.details);
        }

        if (await AdminService.deleteByData(req.body)) {
            req.logOut();
        }

        return res.status(300).redirect('/v1/admins/register');
    } catch (error) {
        if (error instanceof ValidationError) {
            req.flash('error', error.message[0].message);

            return res.status(422).render('delete');
        }

        res.status(500).json({
            message: error.name,
            details: error.message,
        });

        return next(error);
    }
}

module.exports = {
    tagRegisterPage,
    tagLoginPage,
    addAdmin,
    logout,
    tagDeletePage,
    deleteAdmin,
};
