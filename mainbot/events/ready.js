const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "ready",
  async run(client) {
    global.logger.system(`${client.user.tag} is online and ready.`);
    client.user.setActivity(`${await global.botModel.count()} bots.`, {
      type: 3,
    });

    const lb_channel = client.channels.cache.get(
      global.config.channels.leaderboardC
    );
    const lb_message = await lb_channel.messages.fetch(
      global.config.channels.leaderboardM
    );

    setInterval(async () => {
      try {
        const users = await userModel
          .find({ xp: { $gt: 0 } })
          .sort({ level: -1, xp: -1 })
          .limit(10);

        const list = users
          .map(
            (user, i) =>
              `${i + 1}. **${user.username}** | **Level:** ${
                user.level + 1
              } | **XP:** ${user.xp}`
          )
          .join("\n");
        const embed = new EmbedBuilder()
          .setTitle(`Top 10 Leaderboard`)
          .setDescription(`${list}`)
          .setColor("#5565f3")
          .setThumbnail("https://universe-list.xyz/img/icon.png")
          .setTimestamp()
          .setFooter({
            text: lb_message.guild.name + " - Live Leaderboard | Updated",
            iconURL: "https://universe-list.xyz/img/icon.png",
          });

        await lb_message.edit({ embeds: [embed] });
      } catch (err) {
        console.error(err);
      }
    }, 30000);

    // //     setInterval(async () => { // This shouldn't be needed now, since the check is in the POST: /xxx/vote endpoint.
    // //       let voteModels = await global.voteModel.find();
    // //       if (!voteModels.length) return;
    // //       for (const vote of voteModels) {
    // //         let time = vote.time - (Date.now() - vote.date);
    // //         if (time > 0) continue;
    // //         global.voteModel.findOneAndDelete({ bot: vote.bot, user: vote.user });
    // //       }
    // //     }, 300000);

    // setInterval(async () => {
    //   let userModel = await global.userModel.find();
    //   if (!userModel.length) return;
    //   for (const user of userModel) {
    //     const userRaw = await client.users.fetch(user.id);
    //     user.username = userRaw.tag;
    //     await user.save();
    //   }
    // }, 300000);
  },
};
