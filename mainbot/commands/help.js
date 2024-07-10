const { EmbedBuilder } = require("discord.js");
module.exports = {
  name: "help",
  async run(client, message, args) {
    const commands = client.commands
      .filter(
        (c) =>
          c.name !== "help" &&
          c.name !== "htmldesc" &&
          c.name !== "wrongserver" &&
          c.name !== "upto" &&
          c.name !== "declinedbot" &&
          c.name !== "apps" &&
          c.name !== "contribute" &&
          c.name !== "notified"
      )
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
