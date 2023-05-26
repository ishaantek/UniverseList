const config = global.config;
const config = require("../config");

module.exports = {
  async run(client, message) {
    const prefix = config.servers.prefix;

    if (message.author.bot || !message.content.startsWith(prefix)) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    if (command === "ping") {
      message.reply(`:ping_pong: Ping: \`${client.ws.ping}ms\``);
    }
  },
};
