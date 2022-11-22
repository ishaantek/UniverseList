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
  servers: {
    type: String,
    required: false,
    default: 0,
  },
  shards: {
    type: String,
    required: false,
    default: 0,
  },
  website: {
    type: String,
    required: false,
  },
  donate: {
    type: String,
    required: false,
  },
  owner: {
    type: String,
    required: false,
  },
  coowners: {
    type: String,
    required: false,
  },
  prefix: {
    type: String,
    required: false,
  },
  github: {
    type: String,
    required: false,
  },
  views: {
    type: Number,
    required: false,
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
  approvedOn: {
    type: String,
    required: false,
  },
  deniedOn: {
    type: String,
    required: false,
  },
  submittedOn: {
    type: String,
    required: false,
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
  },
  desc: {
    type: String,
    required: false,
  },
  support: {
    type: String,
    required: false,
  },
  reviewer: {
    type: String,
    required: false,
  },
  approved: {
    type: Boolean,
    required: false,
    default: false,
  },
  denied: {
    type: Boolean,
    required: false,
    default: false,
  },
  tested: {
    type: Boolean,
    required: false,
    default: false,
  },
  inprogress: {
    type: Boolean,
    required: false,
    default: false,
  },
  certified: {
    type: Boolean,
    required: false,
    default: false,
  },
  webhook: {
    type: String,
    required: false,
  },
  banner: {
    type: String,
    required: false,
  },
  apikey: {
    type: String,
    required: false,
  },
});
module.exports = mongoose.model("bots", app);
