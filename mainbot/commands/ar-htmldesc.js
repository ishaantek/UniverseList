const { EmbedBuilder } = require("discord.js");
module.exports = {
  name: "htmldesc",
  aliases: ["hd"],
  async run(client, message, args) {
    const embed = new EmbedBuilder()
      .setColor("7289da")
      .setDescription(
        `You can achieve this using Markdown or HTML in your bot's description. You can ask in <#947350824743469086> for help or use [this HTML and Markdown cheatsheet](https://www.markdownguide.org/basic-syntax/) for more resources.`
      )
    return message.channel.send({ embeds: [embed] });
  },
};
