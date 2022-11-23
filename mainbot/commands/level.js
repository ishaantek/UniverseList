const canvacord = require("canvacord");
const { AttachmentBuilder } = require("discord.js");
module.exports = {
  name: "level",
  aliases: ["rank", "lvl"],
  description: "Rank command for users to check their level.",
  async run(_, message) {
    let model = require("../../src/models/user.js");
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
    let flitered = await model.find({}).sort({ xp: -1 }).limit(10);
    let sorted = flitered.map((x) => x.xp).sort((a, b) => b - a);
    let rank = sorted.splice(0, message.guild.memberCount);
    let rankIndex = rank.indexOf(user.xp) + 1;
    const userrank = new canvacord.Rank()
      .setAvatar(img)
      .setCurrentXP(user.xp)
      .setRequiredXP(level * 50)
      .setStatus("online")
      .setLevel(user.level)
      .setRank(rankIndex)
      .setProgressBar("#FFFFFF", "COLOR")
      .setUsername(message.author.username)
      .setDiscriminator(message.author.discriminator);
    userrank.build().then((data) => {
      const attachment = new AttachmentBuilder(data, { name: "RankCard.png" });
      message.reply({ files: [attachment] });
    });
  },
};
