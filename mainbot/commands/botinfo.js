const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");
const model = require("../../src/models/bot.js");
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

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

    const tejas404_data_raw = await fetch(`https://api.tejas404.xyz/utility/application?id=${bot.id}`);
    const tejas404_data = await tejas404_data_raw.json();
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
         value: !tejas404_data.error ? tejas404_data.message.bot.approximate_guild_count : "API Error",
        //value: "N/A",
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
      })
    .setImage(`https://api.tejas404.xyz/image/profileimage?key=${proccess.env.tejas404key}&userid=${bot.id}&customBackground=https%3A%2F%2Fcdn.discordapp.com%2Favatars%2F1018001748020961311%2F05065c21b49163f46da86fc03f8c14ef.png&badgesFrame=true&borderColor=FFFFFF`);
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
