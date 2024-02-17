const Joi = require("joi");

const schema = Joi.object({
    firstName: Joi.string(),
    lastName: Joi.string(),
    verified: Joi.boolean(),
    email: Joi.string().email()
});

module.exports = schema;