const { EmbedBuilder, Message } = require("discord.js");

module.exports = {
  name: "dm",
  description: "DM a user.",
  async run(client, message, args) {
    if (
      !message.member.roles.cache.some(
        (role) => role.id === global.config.roles.admin
      )
    )
      return message.reply(
        "<:no:946581450600370298> Only admins can run this command."
      );

    const user =
      message.mentions.users.first() || client.users.cache.get(args[0]);
    if (!user)
      return message.reply(
        `<:no:946581450600370298> Please provide a user to DM.`
      );

    const str = args.slice(1).join(" ");
    if (message.content.includes("-a")) {
      user.send(str.replace("-a", ""));
    } else {
      user.send(`${str}`);
      message.reply(`<:ul_yes:946581450852016198> User has been DMed successfully.`);
    }
  },
};
