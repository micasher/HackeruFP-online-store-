const Joi = require("joi");

const loginSchema = Joi.object({
  email: Joi.string()
    .regex(
      new RegExp(/^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/)
    )
    .message("Use proper email format. for example: EXAMPLE@EMAILSERVICE.COM")
    .min(6)
    .max(256)
    .required(),
  password: Joi.string()
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=^[^!@#$%^&*()]*[!@#$%^&*()][^!@#$%^&*()]*$).{8,}$/
    )
    .message(
      "Password must contain at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character (@, $, !, %, *, ?, &)"
    )
    .required(),
});

const validateLoginSchema = (userInput) => loginSchema.validateAsync(userInput);

module.exports = {
  validateLoginSchema,
};
