const Joi = require("joi");
const { HttpCode } = require("../../../helpers/constants");

const schemaCreateUser = Joi.object({
  password: Joi.string().min(6).required(),
  email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ["com", "net", "ua"] } })
    .required(),
  subscription: Joi.string()
    .valid("starter", "pro", "business")
    .default("starter")
    .optional(),
});

const schemaLogin = Joi.object({
  password: Joi.string().min(6).required(),
  email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ["com", "net", "ua"] } })
    .required(),
});

const schemaUpdateSubscription = Joi.object({
  subscription: Joi.string().valid("starter", "pro", "business").required(),
});

const validate = async (schema, body, next) => {
  try {
    await schema.validateAsync(body);
    next();
  } catch (err) {
    next({
      status: HttpCode.BAD_REQUEST,
      message: `Field: ${err.message.replace(/"/g, "")}`,
    });
  }
};

module.exports.validateCreateUser = (req, _res, next) => {
  return validate(schemaCreateUser, req.body, next);
};

module.exports.validateLogin = (req, _res, next) => {
  return validate(schemaLogin, req.body, next);
};

module.exports.validateUpdateSubscription = (req, _res, next) => {
  return validate(schemaUpdateSubscription, req.body, next);
};
