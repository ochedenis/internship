const Joi = require('@hapi/joi');

/**
 */
class AdminValidation {

    /**

     */
    validateRegister(data) {
        return Joi.object({
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

    /**

     */
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

    validateToken(data) {
        return Joi
            .object({
                token: Joi
                    .string()
                    .required(),
            })
            .validate(data);
    }

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
}

module.exports = new AdminValidation();