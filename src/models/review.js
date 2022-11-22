const mongoose = require("mongoose");

let app = mongoose.Schema({
  reviewer: {
    type: String,
    required: true,
  },
  botid: {
    type: String,
    required: false,
  },
  rating: {
    type: Number,
    required: false,
  },
  body: {
    type: String,
    required: false,
  },
  date: {
    type: String,
    required: false,
  }
});

module.exports = mongoose.model("review", app);
