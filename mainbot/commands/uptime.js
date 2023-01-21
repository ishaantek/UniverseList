let totalSeconds = client.uptime / 1000;
let days = Math.floor(totalSeconds / 86400);
totalSeconds %= 86400;
let hours = Math.floor(totalSeconds / 3600);
totalSeconds %= 3600;
let minutes = Math.floor(totalSeconds / 60);
let seconds = Math.floor(totalSeconds % 60);
let uptime = `${days} days, ${hours} hours, ${minutes} minutes and ${seconds} seconds`;

module.exports = {
  name: "uptime",
  aliases: ["up"],
  description: "Check the bot's uptime.",
  async run(client, message, args) {
    return await message.reply({
      content: uptime,
    });
  },
};
