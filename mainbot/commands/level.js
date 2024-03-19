const canvacord = require("canvacord");
const { AttachmentBuilder } = require("discord.js");
let model = require("../../src/models/user.js");
module.exports = {
  name: "level",
  aliases: ["rank", "lvl"],
  description: "Rank command for users to check their level.",
  async run(_, message) {
    let user = message.mentions.users.first() || message.author;
    const member = await message.guild.members.fetch(user.id);
    let user_data = await model.findOne({ id: user.id });
    if (!user_data) {
      user_data = new model({
        id: user.id,
        xp: 0,
        level: 0,
      });
      await user_data.save();
    }
    const img = member.displayAvatarURL({
      format: "png",
      dynamic: true,
      size: 1024,
    });
    let level = user_data.level + 1;
    const leaderboard = await model
      .find({ xp: { $gt: 0 } })
      .sort({ level: -1, xp: -1 });
    const rankIndex = leaderboard.findIndex((u) => u.id === user.id) + 1;
    let background = "https://i.ibb.co/Qkg7qXV/Discord-Banner-Blank.jpg";

    const status = member.presence ? member.presence.status : "offline";

    const userRank = new canvacord.Rank()
      .setAvatar(img)
      .setCurrentXP(user_data.xp)
      .setRequiredXP(level * 50)
      .setStatus(status) 
      .setBackground("IMAGE", background)
      .setLevel(level)
      .setRank(rankIndex)
      .setProgressBar("#FFFFFF", "COLOR")
      .setUsername(user.username);
    userRank.build().then((data) => {
      const attachment = new AttachmentBuilder(data, { name: "RankCard.png" });
      message.reply({ files: [attachment] });
    });
  },
};
