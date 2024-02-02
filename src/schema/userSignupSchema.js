const Joi = require("joi");

const schema = Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    gender: Joi.string().valid("male", "female", "others").required(),
    email: Joi.string().email().required(),
    barCouncilId: Joi.string().required(),
    barCouncilNo: Joi.number().required(),
    barCouncilYear: Joi.number().required(),
    state: Joi.string().required(),
    city: Joi.string().required(),
    pincode: Joi.number().required(),
});

module.exports = schema;