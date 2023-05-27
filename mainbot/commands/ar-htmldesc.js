const { EmbedBuilder } = require("discord.js");

module.exports = {
  data: {
    name: "htmldesc",
    description: "Information on using Markdown or HTML in bot descriptions.",
    aliases: ["hd"]
  },
  async execute(interaction) {
    const embed = new EmbedBuilder()
      .setColor("7289da")
      .setDescription(
        "You can achieve this using Markdown or HTML in your bot's description. You can ask in <#947350824743469086> for help or use [this HTML and Markdown cheatsheet](https://www.markdownguide.org/basic-syntax/) for more resources."
      );

    await interaction.reply({ embeds: [embed] });
  },
};
