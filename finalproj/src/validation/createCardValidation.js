import Joi from "joi";

import validation from "./validation";

const createCardSchema = Joi.object({
  title: Joi.string().min(2).max(256).required(),
  description: Joi.string().min(2).max(1024).required(),
  price: Joi.number().min(0).required(),
  stock: Joi.number().min(0).required(),
});

const validateCreateSchema = (userInput) =>
  validation(createCardSchema, userInput);

export default validateCreateSchema;
