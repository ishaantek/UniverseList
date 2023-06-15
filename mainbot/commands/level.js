const canvacord = require("canvacord");
const { AttachmentBuilder } = require("discord.js");
let model = require("../../src/models/user.js");
module.exports = {
  name: "level",
  aliases: ["rank", "lvl"],
  description: "Rank command for users to check their level.",
  async run(_, message) {
    const user = message.mentions.users.first() || message.author
let user_data = await model.findOne({ id: user.id });
if (!user_data) {
  user = new model({
    id: user.id,
    xp: 0,
    level: 0,
  });
  user.save();
}
const img = user.displayAvatarURL();
let level = user_data.level + 1;
const leaderboard = await model
  .find({ xp: { $gt: 0 } })
  .sort({ level: -1, xp: -1 })
const rankIndex = leaderboard.findIndex(
  (u) => u.id === user.id
) + 1;
let background = "https://cdn.discordapp.com/attachments/941896555718410285/1054106088171110480/image.png";
//let rankIndex = rank.includes(user.xp) ? rank.indexOf(user.xp) + 1 : "Not ranked";
const userrank = new canvacord.Rank()
  .setAvatar(img)
  .setCurrentXP(user_data.xp)
  .setRequiredXP(level * 50)
  .setStatus("online")
  .setBackground("IMAGE", background)
  .setLevel(level)
  .setRank(rankIndex)
  .setProgressBar("#FFFFFF", "COLOR")
  .setUsername(user.username);
userrank.build().then((data) => {
  const attachment = new AttachmentBuilder(data, { name: "RankCard.png" }).setDescription(`Rank Image`);
  message.reply({ files: [attachment] });
});

  },
};
