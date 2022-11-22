module.exports = {
  async run(client, member) {
    const id = member.guild.id;
    if (member.user.bot) {
      if (id === global.config.guilds.main) member.roles.add(global.config.roles.bots).catch(() => null);
      else if (id === global.config.guilds.testing) member.roles.add(global.config.roles.botsintesting).catch(() => null);
    } else {
      if (id !== global.config.guilds.main) return;
      client.channels.resolve("941896555718410285")
        .send(`<:awesome:1043642149100601435> \`${member.user.username}\` has joined the server!`)
        .catch(() => null);
      // member.roles.add("1006067703238369291").catch(() => null);
    }
  },
};
