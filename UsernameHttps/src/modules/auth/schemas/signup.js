const Joi = require('joi');

module.exports = (auth) =>
{
    const schema = Joi.object({
        name: Joi.string().min(3).required(),
        username: Joi.string().min(3).required(),
        password: Joi.string().min(3).required(),
        active: Joi.number().integer().required()
    });

    return schema.validate(auth);
}