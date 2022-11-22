const model = require("../../models/server.js");
module.exports = {
  name: "guildCreate",
  async run(sclient, interaction) {
    if (!interaction.isChatInputCommand()) return;

    const command = sclient.commands.get(interaction.commandName);

    if (!command) return;

    try {
      await command.execute(interaction);
    } catch (error) {
      console.error(error);
      await interaction.reply({
        content: "There was an error while executing this command!",
        ephemeral: true,
      });
    }
  },
};
