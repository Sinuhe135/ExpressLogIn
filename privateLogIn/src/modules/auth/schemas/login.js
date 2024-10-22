const Joi = require('joi');

module.exports = (auth) =>
{
    const schema = Joi.object({
        username: Joi.string().min(3).max(20).trim().required(),
        password: Joi.string().min(3).trim().required(),
    });

    return schema.validate(auth);
}