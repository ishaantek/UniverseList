const model = require("../../models/server.js");
const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "guildCreate",
  async run(sclient, guild) {
    const owner = await guild.fetchOwner();
    const currentDate = new Date();

    if (await model.findOne({ id: guild.id })) return;

    const server = await model.create({
      id: guild.id,
      date: currentDate.toLocaleDateString(),
      owner: owner.id,
    });

    const modLogsChannel = sclient.channels.cache.get(global.config.channels.modlogs);
    const guildIcon = guild.iconURL({ dynamic: true });

    const embed = new MessageEmbed()
      .setTitle("New Guild")
      .setColor("GREEN")
      .setThumbnail(guildIcon)
      .setDescription(`**${guild.name}** has invited Universe Servers.`)
      .addFields(
        { name: "Guild Owner:", value: `${owner.user.tag} | \`${owner.id}\`` },
        { name: "Member Count:", value: `${guild.memberCount} members` },
        {
          name: "Date:",
          value: `${currentDate.toLocaleDateString()} - ${currentDate.toLocaleTimeString()}`,
        }
      )
      .setFooter("Universe Servers - Guild Logs", global.sclient.user.displayAvatarURL());

    const sendWelcomeMessage = async () => {
      const welcomeEmbed = new MessageEmbed()
        .setTitle("Thanks for inviting Universe Servers!")
        .setThumbnail("https://universe-list.xyz/img/icon.png")
        .setColor("7289DA")
        .setDescription(
          "Use the command `</invite:1044035064691970060>` to set up your server.\n\n" +
          "**Got any questions?** Join our Discord server below and ask our community!\n" +
          "https://discord.gg/PXdJjTF6yS"
        )
        .setFooter("©️ Universe List 2023, All Rights Reserved.");

      owner.send({ embeds: [welcomeEmbed] });
    };

    sendWelcomeMessage();

    return modLogsChannel.send({ embeds: [embed] });
  },
};
