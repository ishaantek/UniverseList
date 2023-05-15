const { EmbedBuilder } = require("@discordjs/builders");
module.exports = {
  async run(client, member) {
    if (member.guild.id !== global.config.guilds.main) return;
    try {
      const bots = await global.botModel.find({ owner: member.id });

      if (bots) {
        const bot_kick = new EmbedBuilder()
          .setTitle("Bot Kicked")
          .setColor("Red")
          .setDescription(
            "<:ul_no:946581450600370298> " +
              member.user +
              " has left the server, resulting in the removal of their **" +
              bots.length +
              " bots**."
          );
          
        for (const bot of bots) {
          const guild = client.guilds.cache.get(member.guild.id);
          const botMember = await guild.members.fetch(bot.id);
          if (botMember) {
            bot_kick.addFields({
              name: String(botMember.user.tag),
              value: `<@${botMember.id}> has been removed.`,
              inline: true,
            });
            const botm = await global.botModel.findOne({
              id: botMember.id,
            });
            await botm.delete();
            await botMember.kick();
          }

          client.channels
            .resolve(global.config.channels.weblogs)
            .send({ embeds: [bot_kick] });
        }
      }
    } catch (err) {
      console.log(
        `Error occurred while trying to remove a bot owned by ${member.id}: ${err}`
      );
    }
    const embed = new EmbedBuilder()
      .setAuthor({
        name: member.user.tag,
        iconURL: member.user.displayAvatarURL({ dynamic: true }),
      })
      .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
      .setTitle("Member Left")
      .setDescription(`${member.user} has left the server.`)
      .addFields({
        name: "Joined Discord",
        value: `<t:${Math.floor(member.user.createdTimestamp / 1000)}:R>`,
        inline: true,
      })
      .addFields({
        name: "Joined Server",
        value: `<t:${Math.floor(member.joinedTimestamp / 1000)}:R>`,
        inline: true,
      })
      .addFields({ name: "Bot", value: `${member.user.bot}`, inline: true })
      .setFooter({
        text: "Universe List - Member Leave Logs",
        iconURL: client.user.displayAvatarURL(),
      });
    client.channels.resolve("947636978130751578").send({ embeds: [embed] });
  },
};
