const { EmbedBuilder } = require("discord.js");
module.exports = {
  name: "upto",
  aliases: ["ut"],
  async run(client, message, args) {
    const embed = new EmbedBuilder()
      .setColor("7289da")
      .setTitle(
        "<:ul_logo_oval:1051334687647354880> When will my bot be reviewed?"
      )
      .setDescription(
        `The average up-to-date approval times are stated [here](https://discord.com/channels/941896554736934933/1051644809233825843/1069034824368672899).\n\nCurrently our average bot reviewal times are around 12 hours or more. Because of this — and because some bots take longer to review than others due to their features — we can't guarantee your bot will be reviewed as quickly as someone else's in the past and we also can't guarantee your bot will be reviewed within that timeframe. There is no exact time for how long bot approval can take. There is no way to check your bot's position in our reviewal queue, but remember you're not first and you're not last!\n\nYou may edit your bot's page as much as you like both before and after it's reviewed, and this will have no impact on its place in queue.\n\n*<:ul_star:1051329554314178651> In the meantime, please make sure your bot follows all of our [Bot Guidelines](https://universe-list.xyz/bot-requirements) for a quick and smooth approval!*`
      );
    return message.channel.send({ embeds: [embed] });
  },
};
