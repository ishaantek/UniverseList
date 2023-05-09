//-Config Varibles-//
const config = require("./config.js");
const cron = require("node-cron");
global.config = config;
const {
  Client,
  GatewayIntentBits,
  Partials,
  Collection,
  WebhookClient,
  EmbedBuilder,
} = require("discord.js");
//-Other Files-//
require("./app.js");
//-Main Client-//
const client = new Client({
  allowedMentions: {
    parse: ["users", "roles"],
    repliedUser: true,
  },
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildPresences,
  ],
  partials: [Partials.Channel, Partials.Message, Partials.GuildMember],
});
client.commands = new Collection();
client.aliases = new Collection();
client.login(config.bot.token);
global.client = client;
require("../mainbot/client.js");
//-ServerList Client-//
const sclient = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMembers,
  ],
  partials: [Partials.Channel, Partials.GuildMember],
});
sclient.login(config.servers.token);
global.sclient = sclient;
require("./servers/client.js");
//Globals
global.voteModel = require("./models/vote.js");
global.serverVoteModel = require("./models/serverVote.js");
global.serverModel = require("./models/server.js");
global.userModel = require("./models/user.js");
global.botModel = require("./models/bot.js");
global.reviewModel = require("./models/review.js");
//Updater
cron.schedule("*/30 * * * *", () => {
  global.voteModel = require("./models/vote.js");
  global.serverVoteModel = require("./models/serverVote.js");
  global.serverModel = require("./models/server.js");
  global.userModel = require("./models/user.js");
  global.botModel = require("./models/bot.js");
  global.reviewModel = require("./models/review.js");
});
cron.schedule("* * */ 10 * *", async () => {
  let dbots = await global.botModel.find({ denied: true });
  if (!dbots.length) return;
  for (const bot of dbots) {
    const tendaysago = new Date().getTime() - 10 * 24 * 60 * 60 * 1000;
    if (bot.deniedOn < tendaysago) {
      bot.remove().catch(() => null);
    }
  }
});
if (global.config.webhooks.error_logs.enabled) {
  const logs_hook = new WebhookClient({url: global.config.webhooks.error_logs.webhook});
  const embed = new EmbedBuilder()
  .setTimestamp();
  process.on('uncaughtExceptionMonitor', (err, origin) => {
    embed.setTitle("Uncaught Exception Monitor")
    embed.setDescription(`\`\`\`${err}\`\`\``)
    embed.setColor(`#FF0000`);
    logs_hook.send({embeds: [embed]});
  })
  process.on('unhandledRejection', (reason, promise) => {
    
    
    embed.setTitle("Unhandled Rejection")
    embed.setDescription(`\`\`\`${reason}\`\`\``)
    embed.setColor(`#FF0000`);
    logs_hook.send({embeds: [embed]});
  });
  process.on('uncaughtException', (err) => {
    embed.setTitle("Uncaught Exception")
    embed.setDescription(`\`\`\`${err}\`\`\``)
    embed.setColor(`#FF0000`);
    logs_hook.send({embeds: [embed]});
  });
}
