const Joi = require('joi');

module.exports = (auth) =>
{
    const schema = Joi.object({
        password: Joi.string().min(3).trim().required(),
        newPassword: Joi.string().min(3).trim().required()
    });

    return schema.validate(auth);
}