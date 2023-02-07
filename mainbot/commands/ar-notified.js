const { EmbedBuilder } = require("discord.js");
module.exports = {
  name: "notified",
  async run(client, message, args) {
    const embed = new EmbedBuilder()
      .setColor("7289da")
      .setTitle("<:ul_logo_oval:1051334687647354880> Bot Review Notifications")
      .setDescription(
        `**\n<:ul_yes:946581450852016198> If your bot is approved:**\nYou'll be pinged in <#941896555567398982>. You'll be assigned the <@&941896554736934941> role, and your bot will be invited to the server.\n\n**<:ul_no:946581450600370298> If your bot is declined:**\nYou'll be pinged in <#941896555567398982>. Feel free to DM your bot reviewer for an explanation and re-add your bot to the queue again.\n\n*:bulb: Please make sure you have your DMs activated for this server.*`
      );
    return message.channel.send({ embeds: [embed] });
  },
};
