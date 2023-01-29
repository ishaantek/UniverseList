const { EmbedBuilder } = require("discord.js");
module.exports = {
  name: "auto-responders",
  aliases: ["ar"],
  description: "Get a list of auto responders related to Universe List.",
  async run(client, message, args) {
    const embed = new EmbedBuilder()
      .setTitle("Universe List Guides")
      .setColor("7289da")
      .setDescription("**!apps** - Information on volunteer applications.\n**!declinedbot** - Information on declined bots.\n**!upto** - Information on the bot reviewment process.\n**!htmldesc** - Information on making your bot's page.\n**!wrongserver** - Information on how to find a bot's support server.")
      .setFooter({
        text: `${message.guild.name} - Guides Command`,
        iconURL: message.guild.iconURL(),
      });
    return message.channel.send({ embeds: [embed] });
  },
};
