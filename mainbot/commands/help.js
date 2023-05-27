const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "help",
  async run(client, message, args) {
    const excludedCommands = ["help", "htmldesc", "wrongserver", "upto", "declinedbot", "apps", "contribute", "notified"];

    const commands = client.commands
      .filter((c) => !excludedCommands.includes(c.name) && !c.aliases.some((alias) => excludedCommands.includes(alias)))
      .map((c) => `**!${c.name}** - ${c.description}`);

    const embed = new EmbedBuilder()
      .setTitle("Universe List Help")
      .setColor("7289da")
      .setDescription(commands.join("\n"))
      .setFooter({
        text: `${message.guild.name} - Help Command`,
        iconURL: message.guild.iconURL(),
      });

    return message.channel.send({ embeds: [embed] });
  },
};
