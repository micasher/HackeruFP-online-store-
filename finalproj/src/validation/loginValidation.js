import Joi from "joi";

import validation from "./validation";

const loginSchema = Joi.object({
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .message("Use proper email format. for example: EXAMPLE@EMAILSERVICE.COM")
    .required(),
  password: Joi.string()
    .pattern(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=^[^!@#$%^&*()]*[!@#$%^&*()][^!@#$%^&*()]*$).{8,}$/
    )
    .message(
      "Password must contain at least 1 uppercase letter, 1 lowercase letter, 4 digits, and 1 special character (@, $, !, %, *, ?, &)"
    )
    .max(10)
    .required(),
});

const validateLoginSchema = (userInput) => validation(loginSchema, userInput);

export default validateLoginSchema;
