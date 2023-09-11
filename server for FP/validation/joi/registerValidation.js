const Joi = require("joi");

const registerSchema = Joi.object({
  name: Joi.object()
    .keys({
      first: Joi.string().min(2).max(256).required(),
      last: Joi.string().min(2).max(256).required(),
    })
    .required(),

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
  image: Joi.object()
    .keys({
      imageFile: Joi.any(),
      alt: Joi.string().min(2).max(256).required(),
    })
    .allow(null),
});

const validateRegisterSchema = (userInput) =>
  registerSchema.validateAsync(userInput);

module.exports = {
  validateRegisterSchema,
};
