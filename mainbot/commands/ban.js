const { PermissionsBitField, EmbedBuilder } = require("discord.js");
const UserModel = require("../../src/models/user.js");

module.exports = {
  name: "ban",
  description: "Ban a user from the website",
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
      userData = new UserModel({ id: user.id, username: user.username });
    }

    if (userData.banned) {
      return message.reply("This user is already banned.");
    }

    userData.banned = true;
    await userData.save();

    const embed = new EmbedBuilder()
      .setColor("#FF0000") 
      .setTitle("User Banned")
      .setDescription(`${user.username} has been banned from the website.`)
      .setFooter({
        text: "Universe List - Ban command",
        iconURL: global.client.user.displayAvatarURL(),
      });

    return message.reply({ embeds: [embed] });
  },
};
