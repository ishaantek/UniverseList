const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonStyle,
  ButtonBuilder,
} = require("discord.js");

module.exports = {
  name: "hire",
  aliases: ["h"],
  description: "Hire a bot reviewer at Universe List.",
  async run(client, message, args) {
    if (
      !message.member.roles.cache.some(
        (role) => role.id === global.config.roles.admin
      )
    )
      return message.channel.send(
        "<:no:946581450600370298> Only admins can run this command."
      );

    const guild = client.guilds.cache.get(global.config.guilds.main);
    const user =
      message.mentions.users.first() || client.users.cache.get(args[0]);
    if (!user) return message.reply(
      `<:no:946581450600370298> Please provide a user to hire.`
    );
    const member = guild.members.cache.get(user.id);

    member.roles.add(global.config.roles.bottester);
    member.roles.add("942497015231811674");
    member.roles.add("1001901317024907276");

    const testingServer = client.guilds.cache.get(global.config.guilds.testing);

    const invitecode = await testingServer.invites
      .create("1045098855257092126", { maxUses: 1 })
      .catch((e) => e);

    const embed = new EmbedBuilder()
      .setTitle("Congrats on becoming a bot reviewer!")
      .setDescription(
        `\n Please join our testing server here: ${invitecode.url}\nHave any more questions? Contact an admin.`
      )
      .setFooter({
        text: "Universe List - Staff Management",
        iconURL: client.user.displayAvatarURL(),
      });

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setURL(`https://universe-list.com/queue`)
        .setLabel("Bot Queue")
        .setStyle(ButtonStyle.Link)
    );

    user.send({ embeds: [embed], components: [row] });

    const logEmbed = new EmbedBuilder()
      .setAuthor({
        name: member.user.username,
        iconURL: member.user.displayAvatarURL({ dyncamic: true }),
      })
      .setThumbnail(member.user.displayAvatarURL({ dyncamic: true }))
      .setTitle("Bot Reviewer Hired")
      .setDescription(`${member.user} has been hired in Universe List.`)
      .addFields({
        name: "Joined Discord",
        value: `<t:${Math.floor(member.user.createdTimestamp / 1000)}:R>`,
        inline: true,
      })
      .addFields({
        name: "Joined Server",
        value: `<t:${Math.floor(member.joinedTimestamp / 1000)}:R>`,
        inline: true,
      })
      .addFields({
        name: "Admin Responsible",
        value: `${message.author} (${message.author.username})`,
        inline: true,
      })
      .setFooter({
        text: "Universe List - Staff Management Logs",
        iconURL: client.user.displayAvatarURL(),
      });
    client.channels.resolve("948453723166896149").send({ embeds: [logEmbed] });

    message.reply(
      `<:yes:946581450852016198> ${user} has been hired in Universe List.`
    );
  },
};
