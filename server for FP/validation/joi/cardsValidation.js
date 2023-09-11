const Joi = require("joi");

const createCardSchema = Joi.object({
  title: Joi.string().min(2).max(256).required(),
  description: Joi.string().min(2).max(1024).required(),
  price: Joi.number().min(0).required(),
  stock: Joi.number().min(0).required(),
  image: Joi.object().keys({
    imageFile: Joi.any(),
    alt: Joi.string().min(2).max(256).required(),
  }),
});

const validateCardSchema = (userInput) => {
  return createCardSchema.validateAsync(userInput);
};

module.exports = {
  validateCardSchema,
};
