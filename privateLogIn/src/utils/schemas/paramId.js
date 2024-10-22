const Joi = require('joi');

module.exports = (params) =>
{
    const schema = Joi.object({
        id: Joi.number().integer().min(1).required()
    });

    return schema.validate(params);
}