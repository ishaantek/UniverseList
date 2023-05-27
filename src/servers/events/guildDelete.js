const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "guildDelete",
  async run(sclient, guild) {
    if (!guild.available) return;
    const find = await global.serverModel.findOne({ id: guild.id });
    if (!find) return;
    await find.remove().catch(() => null);

    const logs = sclient.channels.cache.get(global.config.channels.modlogs);
    const embed = new EmbedBuilder()
      .setTitle("Guild Removed")
      .setColor("Red")
      .setThumbnail(`${guild.iconURL({ dynamic: true })}`)
      .setDescription(`**${guild.name}** has kicked Universe Servers.`)
      .addFields({
        name: "Member Count:",
        value: `${guild.memberCount} members`,
      })
      .setFooter({
        text: `Universe Servers - Guild Logs`,
        iconURL: `${global.sclient.user.displayAvatarURL()}`,
      });
    return logs.send({ embeds: [embed] });
  },
};

