import Joi from "joi";
import validation from "./validation";

const registerSchema = Joi.object({
  first: Joi.string().min(2).max(256).required(),
  last: Joi.string().min(2).max(256).required(),
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
      "Password must contain at least 1 uppercase letter, 1 lowercase letter, 4 digits, and 1 special character (@, $, !, %, *, ?, &)"
    )
    .required(),
  alt: Joi.string().min(2).max(256).allow(""),
});

const validateRegisterSchema = (userInput) =>
  validation(registerSchema, userInput);

export default validateRegisterSchema;
