const Joi = require('@hapi/joi');

class AdminValidation {
    /* validate admin data at registration */
    validateRegister(data) {
        return Joi
            .object({
                name: Joi
                    .string()
                    .min(3)
                    .max(50)
                    .required(),
                email: Joi
                    .string()
                    .email()
                    .required(),
                password: Joi
                    .string()
                    .min(6)
                    .required(),
            })
            .validate(data);
    }

    /* validate admin data at authorization */
    validateLogin(data) {
        return Joi
            .object({
                email: Joi
                    .string()
                    .email()
                    .required(),
                password: Joi
                    .string()
                    .required(),
            })
            .validate(data);
    }

    /* validate admin data at tokens update */
    validateToken(data) {
        return Joi
            .object({
                token: Joi
                    .string()
                    .required(),
            })
            .validate(data);
    }

    /* validate admin data at logout */
    validateLogout(data) {
        return Joi
            .object({
                email: Joi
                    .string()
                    .email()
                    .required(),
            })
            .validate(data);
    }

    /* validate data for deleting */
    validateDelete(data) {
        return Joi
            .object({
                password: Joi
                    .string()
                    .required(),
                token: Joi
                    .string()
                    .required(),
            })
            .validate(data);
    }
}

module.exports = new AdminValidation();
