const Joi = require('joi');

module.exports = (params) =>
{
    const schema = Joi.object({
        id: Joi.number().integer().min(1).required(),
        token: Joi.string().min(36).max(36).trim().required(),
    });

    return schema.validate(params);
}