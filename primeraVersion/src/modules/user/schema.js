const Joi = require('joi');

module.exports = (user) =>
{
    const schema = Joi.object({
        name: Joi.string().min(3).required(),
        active: Joi.number().integer().required()
    });

    return schema.validate(user);
}