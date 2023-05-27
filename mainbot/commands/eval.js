const { cleanCode, splitMessageRegex } = require("visa2discord");
const { EmbedBuilder } = require("discord.js");
const { inspect } = require("util");

module.exports = {
  name: "eval",
  description: "Evaluates JavaScript code in a command.",
  async run(client, message, args) {
    if (!global.config.developers.includes(message.author.id)) return;

    if (!args[0]) {
      return message.reply({
        content: "<:no:946581450600370298> You must provide code to evaluate.",
      });
    }

    const code = args.join(" ");

    if (code.includes("token")) {
      return message.reply({
        content:
          "Apologies, but you won't be able to acquire the bot token using the eval command. Access to such information is restricted for security reasons.",
      });
    }

    try {
      let evaled = await eval(code);
      let string = cleanCode(inspect(evaled));

      if (string.includes(client.token)) {
        return message.reply({
          content:
            "Apologies, but you won't be able to acquire the bot token using the eval command. Access to such information is restricted for security reasons.",
        });
      }

      const splitDescription = splitMessageRegex(string, {
        maxLength: 2000,
        char: "\n",
        prepend: "```",
        append: "```",
      });

      for (const description of splitDescription) {
        const evalEmbed = new EmbedBuilder()
          .setTitle(`${client.user.username} | Evaluation`)
          .setColor("7289da")
          .setDescription(description);

        await message.channel.send({ embeds: [evalEmbed] });
      }
    } catch (error) {
      const errorEmbed = new EmbedBuilder()
        .setColor("ffc0cb")
        .setTitle("<:ul_no:946581450600370298> Error | An error occurred")
        .setDescription("```" + error + "```");

      await message.channel.send({ embeds: [errorEmbed] });
    }
  },
};
