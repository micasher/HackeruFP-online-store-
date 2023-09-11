const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  email: {
    type: String,
    require: true,
    match: RegExp(/^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/),
    lowercase: true,
    trim: true,
    unique: true,
  },
  attempts: {
    type: Number,
    min: 0,
    max: 3,
    required: true,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const FailedLoginStore = mongoose.model("failedLoginStore", schema);

module.exports = FailedLoginStore;
