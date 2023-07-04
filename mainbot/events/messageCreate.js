module.exports = {
  async run(client, message) {
    if (message.author.bot || !message.guild) return;
    if (message.guild.id !== global.config.guilds.main && message.guild.id !== global.config.guilds.testing) return;

    if (!message.content.toLowerCase().startsWith(global.config.bot.prefix)) {
      let user = await global.userModel.findOne({ id: message.author.id });
      if (!user)
        return await global.userModel.create({
          id: message.author.id,
          username: message.author.username,
          xp: 1,
        });
      user.xp = 1 + user.xp;
      if (message.content.length > 100) user.xp = user.xp + 8;
      if (user.xp % 50 === 0) {
        user.xp = 0;
        user.level = user.level + 1;
        client.channels.cache
          .get(config.channels.levelup)
          .send(
            `GG <@${message.author.id}>, You have leveled up to level ${user.level}!`
          );
      }
      await user.save().catch(() => null);
    } else {
      let args = message.content.split(" ");
      let command = args
        .shift()
        .slice(global.config.bot.prefix.length)
        .toLowerCase();
      let cmd =
        client.commands.get(command) ||
        client.commands.get(client.aliases.get(command));
      if (!cmd) return;
      try {
        cmd.run(client, message, args);
      } catch (error) {
        console.error(error);
      }
    }
  },
};
