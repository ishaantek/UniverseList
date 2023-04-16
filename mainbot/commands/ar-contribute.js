const { EmbedBuilder } = require("discord.js");
module.exports = {
  name: "contribute",
  async run(client, message, args) {
    const embed = new EmbedBuilder()
      .setColor("7289da")
      .setTitle(
        "<:ul_logo_oval:1051334687647354880> Contributors"
      )
      .setDescription(
        `Contributors are not considered staff and there is no age requirement. Contributors help out by fixing things in the source code.\nTo find a list of features that you could add, check <#1044782256805392444>`
      );
    return message.channel.send({ embeds: [embed] });
  },
};
