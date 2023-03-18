const mongoose = require("mongoose");
let hm = new mongoose.Schema({
user: String,
reason: String,
uuid: String
});

module.exports = mongoose.model("site-bans", hm);
