const { EmbedBuilder } = require("discord.js");

module.exports = {
  data: {
    name: "notified",
    description: "Information on bot review notifications."
  },
  async execute(interaction) {
    const embed = new EmbedBuilder()
      .setColor("7289da")
      .setTitle("<:ul_logo_oval:1051334687647354880> Bot Review Notifications")
      .setDescription(
        "If your bot is approved:\n"
        + "You'll be pinged in <#941896555567398982>. You'll be assigned the <@&941896554736934941> role, and your bot will be invited to the server.\n\n"
        + "If your bot is declined:\n"
        + "You'll be pinged in <#941896555567398982>. Feel free to DM your bot reviewer for an explanation and re-add your bot to the queue again.\n\n"
        + ":bulb: Please make sure you have your DMs activated for this server."
      );

    await interaction.reply({ embeds: [embed] });
  },
};
