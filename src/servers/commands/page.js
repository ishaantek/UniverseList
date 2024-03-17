const {
  SlashCommandBuilder,
  EmbedBuilder,
  ButtonBuilder,
  ActionRowBuilder,
  ButtonStyle,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("page")
    .setDescription(
      "Provides you with a link to this server's page on Universe Servers."
    ),
  async execute(interaction) {
    await interaction.deferReply().catch(() => null);
    const server = await global.serverModel.findOne({
      id: interaction.guild.id,
    });
    if (!server)
      return interaction
        .editReply("This server is not on Universe Servers.")
        .catch(() => null);

    const embed = new EmbedBuilder()
      .setTitle(`${interaction.guild.name}'s Page`)
      .setDescription(
        "Click on the button below to go to this server's page on Universe Servers."
      )
      .setFooter({
        text: `Universe List - Page Command`,
        iconURL: global.sclient.user.displayAvatarURL(),
      });

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setURL(`https://universe-list.com/servers/${interaction.guild.id}`)
        .setLabel("View Server Page")
        .setStyle(ButtonStyle.Link)
    );

    return interaction
      .editReply({ embeds: [embed], components: [row] })
      .catch(() => null);
  },
};
