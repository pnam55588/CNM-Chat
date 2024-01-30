const Joi = require('joi');

const updateValidation = (data) => {
    const rule = Joi.object({
        name: Joi.string().min(3).max(30),
        // phone: Joi.string().pattern(new RegExp('^[0-9]{10}$')),
        dateOfBirth: Joi.date(),
        gender: Joi.string().pattern(new RegExp('^(male|female)$')),
        password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,20}$')),
    });
    return rule.validate(data);
}

module.exports.updateValidation = updateValidation;