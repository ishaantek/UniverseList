const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const axios = require('axios');
const model = require("../../src/models/bot.js");

module.exports = {
  name: "botinfo",
  aliases: ["info", "bot", "bi"],
  description: "Find info on a specific bot on Universe List.",
  async run(client, message, args) {
    let bot = message.mentions.users.first() || client.users.cache.get(args[0]);
    if (!bot) return message.reply("Please mention a bot on Universe List.");
    let data = await model.findOne({ id: bot.id });
    if (!data) return message.reply("That's not a bot on Universe List.");
    const botOwner = await client.users.fetch(data.owner);
    
		const response = await axios.get(`https://alprim.rest/api/v1/discord/application/${data.id}`);
    
    let embed = new EmbedBuilder()
      .setAuthor({
        name: `${bot.tag}`,
        iconURL: `${bot.displayAvatarURL()}`,
      })
      .setColor("7289da")
      .setThumbnail(bot.displayAvatarURL())
      .setDescription(
        "**[Vote for " +
          bot.tag +
          " on Universe List](https://universe-list.xyz/bots/" +
          bot.id +
          "/vote)**."
      )
      .addFields({
        name: "Prefix:",
        value: `${data.prefix || "N/A"}`,
        inline: true,
      })
      .addFields({
        name: "Servers:",
        value: `${response || "N/A"}`,
        inline: true,
      })
      .addFields({
        name: "Added on:",
        value: `<t:${Math.floor(data.submittedOn / 1000)}:D>`,
        inline: true,
      })
      .addFields({
        name: "Approved on:",
        value: `<t:${Math.floor(data.approvedOn / 1000)}:D>`,
        inline: true,
      })
      .addFields({
        name: "Tags:",
        value: `${data.tags.join(", ")}`,
        inline: true,
      })
      .addFields({ name: "Owner:", value: `${botOwner.tag}`, inline: true })
      .addFields({
        name: "Short Desc:",
        value: `${data.shortDesc || "N/A"}`,
        inline: true,
      })
      .setFooter({
        text: "Universe List - Bot Info command",
        iconURL: global.client.user.displayAvatarURL(),
      });
    let row = new ActionRowBuilder();

    if (data.invite)
      row.addComponents(
        new ButtonBuilder()
          .setURL(data.invite)
          .setLabel("Invite Link")
          .setStyle(ButtonStyle.Link)
      );

    if (data.support)
      row.addComponents(
        new ButtonBuilder()
          .setURL(`https://discord.gg/${data.support}`)
          .setLabel("Support")
          .setStyle(ButtonStyle.Link)
      );

    if (data.website)
      row.addComponents(
        new ButtonBuilder()
          .setURL(data.website)
          .setLabel("Website")
          .setStyle(ButtonStyle.Link)
      );

    if (data.github)
      row.addComponents(
        new ButtonBuilder()
          .setURL(`${data.github}`)
          .setLabel("Github")
          .setStyle(ButtonStyle.Link)
      );
    return message.reply({ embeds: [embed], components: [row] });
  },
};
