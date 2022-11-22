const mongoose = require("mongoose");

let app = mongoose.Schema({
  id: {
    type: String,
    required: true,
  },
  invite: {
    type: String,
    required: false,
  },
  bumps: {
    type: Number,
    required: false,
    default: 0,
  },
  website: {
    type: String,
    required: false,
  },
  owner: {
    type: String,
    required: false,
  },
  bump: {
    type: Date,
    default: null,
  },
  views: {
    type: Number,
    required: false,
    default: 0,
  },
  votes: {
    type: Number,
    required: false,
    default: 0,
  },
  votedate: {
    type: Number,
    required: false,
  },
  date: {
    type: String,
    required: false,
  },
  published: {
    type: Boolean,
    required: false,
    default: false,
  },
  uniqueViews: {
    type: Number,
    required: false,
  },
  tags: {
    type: Array,
    required: false,
  },
  shortDesc: {
    type: String,
    required: false,
    default: "This server has no short description.",
  },
  desc: {
    type: String,
    required: false,
    default: "This server has no long description.",
  },
});
module.exports = mongoose.model("server", app);
