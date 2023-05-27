const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "ready",
  async run(client) {
    global.logger.system(`${client.user.tag} is online and ready.`);
    client.user.setActivity(`${await global.botModel.count()} bots.`, {
      type: "WATCHING",
    });

    const lbChannel = client.channels.cache.get(
      global.config.channels.leaderboardC
    );
    const lbMessage = await lbChannel.messages.fetch(
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
              `${i + 1}. **${user.username}** | **Level:** ${user.level + 1} | **XP:** ${user.xp}`
          )
          .join("\n");

        const embed = new EmbedBuilder()
          .setTitle("Top 10 Leaderboard")
          .setDescription(`${list}`)
          .setColor("#5565f3")
          .setThumbnail("https://universe-list.xyz/img/icon.png")
          .setTimestamp()
          .setFooter({
            text: `${lbMessage.guild.name} - Live Leaderboard | Updated`,
            iconURL: "https://universe-list.xyz/img/icon.png",
          });

        await lbMessage.edit({ embeds: [embed] });
      } catch (err) {
        console.error(err);
      }
    }, 30000);
  },
};
