const Joi = require('joi');

const registerValidation = (data) => {
    const rule = Joi.object({
        name: Joi.string().min(3).max(30).required(),
        email: Joi.string().min(6).max(30).required().email(),
        password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,20}$')).required(),
    });
    return rule.validate(data);
}
module.exports.registerValidation = registerValidation;