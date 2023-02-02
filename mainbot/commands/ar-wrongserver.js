const { EmbedBuilder } = require("discord.js");
module.exports = {
  name: "wrongserver",
  aliases: ["ws"],
  async run(client, message, args) {
    const embed = new EmbedBuilder()
      .setColor("7289da")
      .setImage("https://i.ibb.co/S0mFwc9/image.png")
      .setDescription(
        `<:ul_dotBlue:1017569447852130324> Hey! We think you have our server mistaken. We do not provide support, help, or advice for any bot. You need to click on the "Support" button on the bot's page of the bot you need support for. If there isn't a button that says " Support" or nothing else mentioned about a support server, then the best option is to try and DM the owner.`
      );
    return message.channel.send({ embeds: [embed] });
  },
};
