const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonStyle,
  ButtonBuilder,
} = require("discord.js");

module.exports = {
  name: "fire",
  aliases: ["f"],
  description: "Fire a bot reviewer at Universe List.",
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
    if (!user)
      return message.reply(
        `<:no:946581450600370298> Please provide a user to fire.`
      );
    const reason = args.splice(1).join(" ");
    if (!reason)
      return message.reply(
        "<:no:946581450600370298> Please state a reason explaing why this user is fired."
      );
    const member = guild.members.cache.get(user.id);

    member.roles.remove(global.config.roles.bottester);
    member.roles.remove("942497015231811674");
    member.roles.remove("1001901317024907276");

    const testingServer = client.guilds.cache.get(global.config.guilds.testing);
    const kickUser = testingServer.members.cache.get(user.id);

    try {
      kickUser.kick({
        reason: `This user has been fired from Universe List by: ${message.author.tag}.`,
      });
    } catch (err) {}

    const embed = new EmbedBuilder()
      .setTitle("You have been fired from Universe List.")
      .setDescription(
        `Think we make a mistake? Contact an admin for more information.`
      )
      .addFields({ name: "Reason Given", value: `${reason}`, inline: true })
      .setFooter({
        text: "Universe List - Staff Management",
        iconURL: client.user.displayAvatarURL(),
      });

    user.send({ embeds: [embed] });

    const logEmbed = new EmbedBuilder()
      .setAuthor({
        name: member.user.tag,
        iconURL: member.user.displayAvatarURL({ dyncamic: true }),
      })
      .setThumbnail(member.user.displayAvatarURL({ dyncamic: true }))
      .setTitle("Bot Reviewer Fired")
      .setDescription(`${member.user} has been fired from Universe List.`)
      .addFields({
        name: "Admin Responsible",
        value: `${message.author} (${message.author.tag})`,
        inline: true,
      })
      .addFields({ name: "Reason Given", value: `${reason}`, inline: true })
      .setFooter({
        text: "Universe List - Staff Management Logs",
        iconURL: client.user.displayAvatarURL(),
      });
    client.channels.resolve("948453723166896149").send({ embeds: [logEmbed] });

    message.reply(
      `<:yes:946581450852016198> ${user} has been fired from Universe List.`
    );
  },
};
