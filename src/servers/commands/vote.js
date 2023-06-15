const {
  SlashCommandBuilder,
  EmbedBuilder,
  ButtonBuilder,
  ActionRowBuilder,
  ButtonStyle,
} = require("discord.js");
const ms = require("ms");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("vote")
    .setDescription("Vote for this server on Universe Servers."),
  async execute(interaction) {
    await interaction.deferReply().catch(() => null);
    let server = await global.serverModel.findOne({ id: interaction.guild.id });
    if (!server)
      return interaction
        .editReply("This server was not found on Universe Servers.")
        .catch(() => null);
    if (!server.published)
      return interaction
        .editReply(
          "This server is not published on Universe Servers yet.\nRun the /help command for more info."
        )
        .catch(() => null);

    let x = await global.serverVoteModel.findOne({
      user: interaction.user.id,
      server: interaction.guild.id,
    });
    if (x) {
      let timeObj = ms(x.time - (Date.now() - x.date), { long: true });
      return interaction
        .editReply(
          `You can only vote once per hour.\nPlease come back in ${timeObj}.`
        )
        .catch(() => null);
    }

    await global.serverVoteModel.create({
      user: interaction.user.id,
      server: interaction.guild.id,
      date: Date.now(),
      time: 3600000,
    });
    server.votes++;
    await server.save().catch(() => null);
    const logs = global.sclient.channels.resolve(
      global.config.channels.weblogs
    );
    const date = new Date();
    const votedEmbed = new EmbedBuilder()
      .setTitle("Server Voted")
      .setDescription(
        `<:vote:1043639183991898203> ${interaction.guild.name} has been voted on Universe Servers.`
      )
      .setColor("#7289da")
      .addFields({
        name: "Server",
        value: `[${interaction.guild.name}](https://universe-list.xyz/servers/${interaction.guild.id})`,
        inline: true,
      })
      .addFields({
        name: "Voter",
        value: `[${interaction.user.username}](https://universe-list.xyz/users/${interaction.user.id})`,
        inline: true,
      })
      .addFields({
        name: "Date",
        value: `${date.toLocaleString()}`,
        inline: true,
      })
      .setFooter({
        text: "Vote Logs - Universe Servers",
        iconURL: global.sclient.user.displayAvatarURL(),
      });
    if (logs) logs.send({ embeds: [votedEmbed] }).catch(() => null);

    const embed = new EmbedBuilder()
      .setTitle("Successful Vote")
      .setDescription(
        "You have successfully voted for this server on [Universe Servers](https://universe-list.xyz/servers)."
      )
      .setFooter({
        text: `Universe Servers - Vote Command`,
        iconURL: global.sclient.user.displayAvatarURL(),
      });

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setURL(`https://universe-list.xyz/servers/${interaction.guild.id}`)
        .setLabel("View Server Page")
        .setStyle(ButtonStyle.Link)
    );

    return interaction
      .editReply({ embeds: [embed], components: [row] })
      .catch(() => null);
  },
};
