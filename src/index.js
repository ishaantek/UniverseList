//-Config Varibles-//
const config = require("./config.js");
const cron = require("node-cron");
global.config = config;
const {
  Client,
  GatewayIntentBits,
  Partials,
  Collection,
} = require("discord.js");
<<<<<<< HEAD
const ms = require("ms");
const fetch = (...args) =>
    import("node-fetch").then(({
        default: fetch
    }) => fetch(...args));
const mongoose = require("mongoose");
const config = global.config;
const path = require("path");
global.logger = logger;
const express = require("express"),
    session = require("express-session"),
    passport = require("passport"),
    Strategy = require("passport-discord").Strategy;
const SQLiteStore = require("connect-sqlite3")(session);
const helmet = require("helmet");
const banSchema = require("./models/site-ban.js"); // Ban DataBase
// const rateLimit = require('express-rate-limit')
Array.prototype.shuffle = function() {
    // Define this once
    return (
        this.map(
            (k, i, o, p = Math.floor(Math.random() * this.length)) =>
            ([o[i], o[p]] = [o[p], o[i]])
        ) && this
    );
};
require("https").globalAgent.options.rejectUnauthorized = false;
=======
>>>>>>> parent of 5c12d6d (Added a feature to Site ban a user discord's ID  (#20))

//-Other Files-//
require("./app.js");

//-Main Client-//

<<<<<<< HEAD
try {
    mongoose.connect(config.mongo).then(logger.system("Mongoose connected."));
} catch (error) {
    console.log(error);
}

//-Webserver-//

const app = express();

/* const limiter = rateLimit({
   windowMs: 15 * 60 * 1000,
   max: 100,
   standardHeaders: true,
 }) */

// Apply the rate limiting middleware to all requests
//app.use(limiter)
app.use(express.json());
app.use(
  express.urlencoded({
    extended: false,
  })
);
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
  })
);
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/static"));
app.set("views", path.join(__dirname, "pages"));

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "http://localhost");
    res.header("Access-Control-Allow-Headers", "*");
    res.header("Access-Control-Allow-Methods", "*");
    if (req.method === "OPTIONS") {
        res.status(200).send();
    } else {
        next();
    }
=======
const client = new Client({
  allowedMentions: {
    parse: ["users", "roles"],
    repliedUser: false,
  },
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildPresences,
  ],
  partials: [Partials.Channel, Partials.Message, Partials.GuildMember],
>>>>>>> parent of 5c12d6d (Added a feature to Site ban a user discord's ID  (#20))
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
global.reviewModel = require("./models/review.js")

//Updater
cron.schedule("*/30 * * * *", () => {
  global.voteModel = require("./models/vote.js");
  global.serverVoteModel = require("./models/serverVote.js");
  global.serverModel = require("./models/server.js");
  global.userModel = require("./models/user.js");
  global.botModel = require("./models/bot.js");
  global.reviewModel = require("./models/review.js")
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
//process.on('unhandledRejection', (reason, promise) => console.log(`Unhandled Rejection at: ${promise} reason: ${reason}`));
//process.on('uncaughtException', (err) => console.log(`Uncaught Exception: ${err}`))
