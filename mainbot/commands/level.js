const canvacord = require("canvacord");
const { AttachmentBuilder } = require("discord.js");
let model = require("../../src/models/user.js");
module.exports = {
  name: "level",
  aliases: ["rank", "lvl"],
  description: "Rank command for users to check their level.",
  async run(_, message) {
let user = await model.findOne({ id: message.author.id });
if (!user) {
  user = new model({
    id: message.author.id,
    xp: 0,
    level: 0,
  });
  user.save();
}
const img = message.author.displayAvatarURL();
let level = user.level + 1;
let flitered = await model.find({}).sort({ xp: -1 });
let rank = flitered.findIndex((x) => x.id === user.id) + 1;
let background = "https://cdn.discordapp.com/attachments/941896555718410285/1054106088171110480/image.png";
//let rankIndex = rank.includes(user.xp) ? rank.indexOf(user.xp) + 1 : "Not ranked";
const userrank = new canvacord.Rank()
  .setAvatar(img)
  .setCurrentXP(user.xp)
  .setRequiredXP(level * 50)
  .setStatus("online")
  .setBackground("IMAGE", background)
  .setLevel(user.level)
  .setRank(rank)
  .setProgressBar("#FFFFFF", "COLOR")
  .setUsername(message.author.username)
  .setDiscriminator(message.author.discriminator);
userrank.build().then((data) => {
  const attachment = new AttachmentBuilder(data, { name: "RankCard.png" });
  message.reply({ files: [attachment] });
});

  },
};
