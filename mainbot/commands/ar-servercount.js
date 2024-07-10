const { EmbedBuilder } = require("discord.js");
module.exports = {
  name: "htmldesc",
  aliases: ["hd"],
  async run(client, message, args) {
    const embed = new EmbedBuilder()
      .setColor("7289da")
      .setDescription(
        `To display your bot's server count on the Universe List, please refer to the [API documentation](https://universe-list.com/docs) regarding server/shard posting.\n\nAlternatively, if your bot is developed using Discord.js, you can utilize our [NPM Package](https://www.npmjs.com/package/universe-list.js).`
      );
    return message.channel.send({ embeds: [embed] });
  },
};
