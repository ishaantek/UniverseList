const { EmbedBuilder } = require("discord.js");
module.exports = {
  name: "auto-responses",
  aliases: ["ar"],
  description: "Get a list of auto responses related to Universe List.",
  async run(client, message, args) {
    const embed = new EmbedBuilder()
      .setTitle("Universe List Auto Responses")
      .setColor("7289da")
      .setDescription(
        "**!apps** - Information on volunteer applications.\n**!declinedbot** - Information on declined bots.\n**!upto** - Information on the bot reviewment process.\n**!htmldesc** - Information on making your bot's page.\n**!wrongserver** - Information on how to find a bot's support server.\n**!notified** - Information on how to check if your bot was reviewed.\n**!servercount** - Instructions to display bot's server count."
      )
      .setFooter({
        text: `${message.guild.name} - Guides Command`,
        iconURL: message.guild.iconURL(),
      });
    return message.channel.send({ embeds: [embed] });
  },
};
