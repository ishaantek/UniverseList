const { EmbedBuilder } = require("discord.js");
module.exports = {
  name: "apps",
  async run(client, message, args) {
    const embed = new EmbedBuilder()
      .setColor("7289da")
      .setTitle(
        "<:ul_logo_oval:1051334687647354880> Volunteer Applications"
      )
      .setDescription(
        `Hey! It seems like you're interested in volunteering for Universe List. We're glad for any help we can get regarding our server events, support articles, bot reviewing, moderation, and more!\n\n
<:ul_contributor:1069048686245584906> **Contributors**\nContributors are not considered staff and there is no age requirement. Contributors help out by fixing things in the source code.\n\n<:ul_botReviewer:1069048684777586708> **Bot Reviewers**\nBot Reviewers are Universe List staff and must be 15 or older. Bot reviewers review the bots submitted to the site before they are listed to make sure they follow our rules.\n\n<:ul_moderator:1069048687235432558> Moderators\nBot Reviewer is a stepping stone to Moderator - if you wish to be a Moderator you must first apply and be accepted as a Bot Reviewer.\n\n**<:ul_dotBlue:1017569447852130324> When applications are opened, we'll announce it in <#1051644809233825843>.**`
      );
    return message.channel.send({ embeds: [embed] });
  },
};
