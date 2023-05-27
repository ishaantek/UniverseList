const { EmbedBuilder } = require("discord.js");

module.exports = {
  data: {
    name: "auto-responses",
    description: "Get a list of auto responses related to Universe List.",
    aliases: ["ar"]
  },
  async execute(interaction) {
    const embed = new EmbedBuilder()
      .setTitle("Universe List Auto Responses")
      .setColor("7289da")
      .setDescription(
        "**/apps** - Information on volunteer applications.\n**/declinedbot** - Information on declined bots.\n**/upto** - Information on the bot review process.\n**/htmldesc** - Information on creating your bot's page.\n**/wrongserver** - Information on finding a bot's support server.\n**/notified** - Information on how to check if your bot was reviewed.\n**/servercount** - Instructions to display your bot's server count."
      )
      .setFooter({
        text: `${interaction.guild.name} - Guides Command`,
        iconURL: interaction.guild.iconURL(),
      });

    await interaction.reply({ embeds: [embed] });
  },
};
