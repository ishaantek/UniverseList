const model = require("../../models/server.js");
const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "guildCreate",
  async run(sclient, guild) {
    let owner = await guild.fetchOwner();
    const d = new Date();

    if (await model.findOne({ id: guild.id })) return;

    let server = await model.create({
      id: guild.id,
      date: d.toLocaleDateString(),
      owner: owner.id,
    });
    const logs = sclient.channels.cache.get(global.config.channels.modlogs);
    const embed = new EmbedBuilder()
      .setTitle("New Guild")
      .setColor("Green")
      .setThumbnail(`${guild.iconURL({ dynamic: true })}`)
      .setDescription(`**${guild.name}** has invited Universe Servers.`)
      .addFields(
        { name: "Guild Owner:", value: `${owner.user.tag} | \`${owner.id}\`` },
        { name: "Member Count:", value: `${guild.memberCount} members` },
        {
          name: "Date:",
          value: `${d.toLocaleDateString()} - ${d.toLocaleTimeString()}`,
        }
      )
      .setFooter({
        text: `Universe Servers - Guild Logs`,
        iconURL: `${global.sclient.user.displayAvatarURL()}`,
      });

    let getOwners = async () => {
      let owner = await guild.fetchOwner().catch((err) => err);
      return owner;
    };
    getOwners().then((owner) => {
      if (owner !== undefined) {
        var serverIcon = guild.iconURL();

        const welcomeEmbed = new EmbedBuilder()
          .setTitle("Thanks for inviting Universe Servers!")
          .setThumbnail("https://universe-list.xyz/img/icon.png")
          .setColor("7289da")
          .setDescription(
            "Use the command </invite:1044035064691970060> to setup your server.\n\n**Got Any Questions?**\n Join our Discord server below and ask our community!\nhttps://discord.gg/PXdJjTF6yS "
          )

          .setFooter({
            text: `Universe Servers - Guild Logs`,
          });
        owner.send({ embeds: [welcomeEmbed] });
      }
    });

    return logs.send({ embeds: [embed] });
  },
};
