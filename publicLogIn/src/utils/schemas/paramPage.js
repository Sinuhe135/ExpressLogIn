const Joi = require('joi');

module.exports = (params) =>
{
    const schema = Joi.object({
        page: Joi.number().integer().min(1).required()
    });

    return schema.validate(params);
}