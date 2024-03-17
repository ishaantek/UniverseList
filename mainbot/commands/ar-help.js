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
        "**ul!apps** - Information on volunteer applications.\n**ul!declinedbot** - Information on declined bots.\n**ul!upto** - Information on the bot reviewment process.\n**ul!htmldesc** - Information on making your bot's page.\n**ul!wrongserver** - Information on how to find a bot's support server.\n**ul!notified** - Information on how to check if your bot was reviewed.\n**ul!servercount** - Instructions to display bot's server count."
      )
      .setFooter({
        text: `${message.guild.name} - Guides Command`,
        iconURL: message.guild.iconURL(),
      });
    return message.channel.send({ embeds: [embed] });
  },
};
