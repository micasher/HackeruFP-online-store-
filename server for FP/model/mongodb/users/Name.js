const mongoose = require("mongoose");

const {
  DEFAULT_STRING_SCHEMA_REQUIRED,
} = require("./helpers/mongooseValidation");

const Name = new mongoose.Schema({
  first: DEFAULT_STRING_SCHEMA_REQUIRED,
  last: DEFAULT_STRING_SCHEMA_REQUIRED,
});

module.exports = Name;
