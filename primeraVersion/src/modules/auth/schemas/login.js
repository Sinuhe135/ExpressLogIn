const Joi = require('joi');

module.exports = (auth) =>
{
    const schema = Joi.object({
        username: Joi.string().min(3).required(),
        password: Joi.string().min(3).required(),
    });

    return schema.validate(auth);
}