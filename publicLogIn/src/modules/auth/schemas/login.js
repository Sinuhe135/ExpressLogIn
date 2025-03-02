const Joi = require('joi');

module.exports = (auth) =>
{
    const schema = Joi.object({
        email: Joi.string().email().trim().required(),
        password: Joi.string().min(3).trim().required(),
    });

    return schema.validate(auth);
}