import Joi from "joi";
import validation from "./validation";

const editProfileSchema = Joi.object({
  first: Joi.string().min(2).max(256).required(),
  last: Joi.string().min(2).max(256).required(),
  email: Joi.string()
    .regex(/^([a-zA-Z0-9_\-.])+@([a-zA-Z0-9_\-.])+\.([a-zA-Z]{2,5})$/)
    .min(6)
    .max(256)
    .required(),
});

const validateEditProfileSchema = (userInput) =>
  validation(editProfileSchema, userInput);

export default validateEditProfileSchema;
