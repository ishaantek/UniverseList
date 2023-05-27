const config = global.config;
module.exports = {
  async run(client, message) {
    let prefix = config.servers.prefix;
    if (message.author.bot) return;
    if (!message.content.startsWith(prefix)) return;

    if (message.content.startsWith(prefix + "ping")) {
      message.reply(`:ping_pong: Ping: \`${client.ws.ping}ms\``);
    }
  },
};
