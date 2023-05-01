const { EmbedBuilder } = require("@discordjs/builders");

module.exports = {
  async run(client, member) {
    if (member.guild.id !== global.config.guilds.main) return;

    const embed = new EmbedBuilder()
      .setAuthor({
        name: member.user.tag,
        iconURL: member.user.displayAvatarURL({ dyncamic: true }),
      })
      .setThumbnail(member.user.displayAvatarURL({ dyncamic: true }))
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
