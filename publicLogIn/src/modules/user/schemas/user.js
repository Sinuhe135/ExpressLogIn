const Joi = require('joi');

module.exports = (user) =>
{
    const schema = Joi.object({
        name: Joi.string().min(3).max(30).trim().required(),
        patLastName: Joi.string().min(3).max(30).trim().required(),
        matLastName: Joi.string().min(3).max(30).trim(),
        phone: Joi.string().min(3).max(15).trim().required()
    });

    return schema.validate(user);
}