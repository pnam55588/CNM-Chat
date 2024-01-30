const Joi = require('joi');

const registerValidation = (data) => {
    const rule = Joi.object({
        name: Joi.string().min(3).max(30).required(),
        // email: Joi.string().min(6).max(30).required().email(),
        phone: Joi.string().pattern(new RegExp('^[0-9]{10}$')).required(),
        password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,20}$')).required(),
    });
    return rule.validate(data);
}

const loginValidation = (data) => {
    const rule = Joi.object({
        // email: Joi.string().min(6).max(30).required().email(),
        phone: Joi.string().pattern(new RegExp('^[0-9]{10}$')).required(),
        password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,20}$')).required(),
    });
    return rule.validate(data);
}

module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;
