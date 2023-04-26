const mongoose = require("mongoose");

let app = mongoose.Schema({
  bot: {
    type: String,
    required: true,
  },
  user: {
    type: String,
    required: false,
  },
  time: {
    type: Number,
    required: false,
  },
  date: {
    type: Number,
    required: false,
  },
});

module.exports = mongoose.model("votes", app);
