const mongoose = require("mongoose");
const Image = require("./Image");
const {
  DEFAULT_STRING_SCHEMA_REQUIRED,
} = require("./helpers/mongooseValidation");

const cardSchema = new mongoose.Schema({
  title: DEFAULT_STRING_SCHEMA_REQUIRED,
  price: {
    type: Number,
    minLength: 1,
    required: true,
    trim: true,
  },
  description: { ...DEFAULT_STRING_SCHEMA_REQUIRED, maxLength: 1024 },
  image: Image,
  rating: {
    ratingUsers: [String],
    ratingScore: { type: Number },
  },
  cart: [String],
  stock: { type: Number },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Card = mongoose.model("cards", cardSchema);

module.exports = Card;
