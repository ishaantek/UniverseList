const { EmbedBuilder } = require("discord.js");
module.exports = {
  name: "declinedbot",
  aliases: ["db"],
  async run(client, message, args) {
    const embed = new EmbedBuilder()
      .setColor("7289da")
      .setImage(
        "https://i.ibb.co/6Ynnh1D/Screenshot-2023-01-28-at-7-03-06-PM.png"
      )
      .setDescription(
        `Your bot was likely declined because it went against our [bot guidelines](https://universe-list.xyz/bot-requirements).\n\nPlease contact your bot reviewer in a direct message if you have questions about the decline reason.\n\nTo find out why your bot was declined and by who, use the search feature in <#941896555567398982>:`
      );
    return message.channel.send({ embeds: [embed] });
  },
};
