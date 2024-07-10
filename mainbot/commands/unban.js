const { PermissionsBitField, EmbedBuilder } = require("discord.js");
const UserModel = require("../../src/models/user.js");

module.exports = {
  name: "unban",
  description: "Unban a user from the website",
  async run(client, message, args) {
    if (!message.member.permissions.has(PermissionsBitField.Flags.BanMembers)) {
      return message.reply("You do not have permission to use this command.");
    }

    const user =
      message.mentions.users.first() || client.users.cache.get(args[0]);
    if (!user) {
      return message.reply("Please mention a user or provide their user ID.");
    }

    let userData = await UserModel.findOne({ id: user.id });
    if (!userData) {
      return message.reply("This user is not found in the database.");
    }

    if (!userData.banned) {
      return message.reply("This user is not banned.");
    }

    userData.banned = false;
    await userData.save();

    const embed = new EmbedBuilder()
      .setColor("#00FF00") 
      .setTitle("User Unbanned")
      .setDescription(`${user.username} has been unbanned from the website.`)
      .setFooter({
        text: "Universe List - Unban command",
        iconURL: global.client.user.displayAvatarURL(),
      });

    return message.reply({ embeds: [embed] });
  },
};
