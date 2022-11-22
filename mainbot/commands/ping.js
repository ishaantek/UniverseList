module.exports = {
  name: "ping",
  description: "Check the bots ping. (Delay)",
  async run(client, message, args) {
    return await message.reply({
      content: `<:pong:1016422519214964766> Ping: \`${client.ws.ping}ms\``,
    });
  },
};
