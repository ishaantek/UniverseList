const { EmbedBuilder } = require("@discordjs/builders");
const Bot = global.botModel
module.exports = {
  async run(client, member) {
    if (member.guild.id !== global.config.guilds.main) return;
    try {
      const bots = await global.botModel.findOne({ owner: member.id });
      if (bots.length > 0) {
        const bot_kick = new EmbedBuilder()
          .setAuthor({
            name: member.user.tag,
            iconURL: member.user.displayAvatarURL({ dynamic: true }),
          })
          .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
          .setTitle("Bot Kicked")
          .setDescription(
            `${member.user} (${member.user.tag}) has left the server as a result of their **${bots.length} bots** being removed from the list and kicked from the server.`
          );

        for (const bot of bots) {
          const guild = client.guilds.cache.get(member.guild.id);
          const botMember = await guild.members.cache.fetch(bot.id);
          if (botMember) {
            bot_kick.addFields({
              name: botMember.user.tag,
              value: `<@${botMember.id}> has been kicked as a result of their owner leaving the server`,
              inline: true,
            });
            await Bot.deleteOne({ id: bot.id });
            await botMember.kick();
            await Bot.deleteOne({ id: bot.id });
          }
          
          client.channels
            .resolve(global.config.channels.modlogs)
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
