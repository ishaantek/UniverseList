const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "guildDelete",
  async run(sclient, guild) {
    if (!guild.available) return;
    const find = await global.serverModel.findOne({ id: guild.id });
    if (!find) return;
    await find.remove().catch(() => null);

    const modLogsChannel = sclient.channels.cache.get(global.config.channels.modlogs);
    const guildIcon = guild.iconURL({ dynamic: true });

    const embed = new MessageEmbed()
      .setTitle("Guild Removed")
      .setColor("RED")
      .setThumbnail(guildIcon)
      .setDescription(`**${guild.name}** has removed Universe Servers.`)
      .addFields({ name: "Member Count:", value: `${guild.memberCount} members` })
      .setFooter("Universe Servers - Guild Logs", global.sclient.user.displayAvatarURL());

    return modLogsChannel.send({ embeds: [embed] });
  },
};
