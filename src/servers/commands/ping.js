const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Check if the bot is up and running."),
  async execute(interaction) {
    return interaction
      .reply(`<:pong:1016422519214964766> Ping: \`${sclient.ws.ping}ms\``)
      .catch(() => null);
  },
};
