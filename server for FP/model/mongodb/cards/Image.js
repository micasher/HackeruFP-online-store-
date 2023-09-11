const mongoose = require("mongoose");
const {
  DEFAULT_STRING_SCHEMA_REQUIRED,
} = require("./helpers/mongooseValidation");
const { UploadSchema } = require("../Upload");

const Image = new mongoose.Schema({
  imageFile: UploadSchema,
  alt: DEFAULT_STRING_SCHEMA_REQUIRED,
});

module.exports = Image;
