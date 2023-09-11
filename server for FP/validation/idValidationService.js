const config = require("config");
const validatorOption = config.get("validatorOption");
const joiIdValidation = require("./joi/idValidation");

const idValidation = (id) => {
  if (validatorOption === "Joi") {
    return joiIdValidation.validateIdSchema({ id });
  }
  throw new Error("validator undefined");
};

module.exports = {
  idValidation,
};
