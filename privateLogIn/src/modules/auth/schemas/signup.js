const Joi = require('joi');

module.exports = (auth) =>
{
    const schema = Joi.object({
        username: Joi.string().min(3).max(20).trim().required(),
        password: Joi.string().min(3).trim().required(),
        name: Joi.string().min(3).max(30).trim().required(),
        patLastName: Joi.string().min(3).max(30).trim().required(),
        matLastName: Joi.string().min(3).max(30).trim(),
        phone: Joi.string().min(3).max(15).trim().required(),
        type: Joi.string().valid('admin','general').required(),
    });

    return schema.validate(auth);
}