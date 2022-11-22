const mongoose = require("mongoose");

let app = mongoose.Schema({
  id: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: false,
  },
  bio: {
    type: String,
    required: false,
  },
  xp: {
    type: Number,
    required: false,
    default: 0,
  },
  level: {
    type: Number,
    required: false,
    default: 0,
  },
  ApiKey: {
    type: String,
    required: false,
  },
  website: {
    type: String,
    required: false,
  },
  github: {
    type: String,
    required: false,
  },
  twitter: {
    type: String,
    required: false
  }
});
module.exports = mongoose.model("users", app);
