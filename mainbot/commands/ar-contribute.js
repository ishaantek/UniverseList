const { EmbedBuilder } = require("discord.js");
module.exports = {
  name: "contribute",
  async run(client, message, args) {
    const embed = new EmbedBuilder()
      .setColor("7289da")
      .setTitle("<:ul_contributor:1104909588416962590> Contributors")
      .setDescription(
        `Contributors play a vital role in improving the source code by identifying and fixing issues. Being a contributor does not require staff status nor is there any age requirement. \n\nWe value and appreciate the efforts of our contributors, and recognize their contributions as key to the success of our project. If you're looking for ideas on features to add, please refer to <#1044782256805392444>`
      );
    return message.channel.send({ embeds: [embed] });
  },
};
