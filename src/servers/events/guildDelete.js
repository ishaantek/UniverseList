module.exports = {
  name: "guildDelete",
  async run(sclient, guild) {
    if (!guild.available) return;
    const find = await global.serverModel.findOne({ id: guild.id });
    if (!find) return;
    await find.remove().catch(() => null);
  },
};
