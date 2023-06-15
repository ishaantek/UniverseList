const logger = require("../functions/logger");
const {
  EmbedBuilder,
  ButtonBuilder,
  ActionRowBuilder,
  ButtonStyle,
  PermissionFlagsBits,
} = require("discord.js");
const ms = require("ms");
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));
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

// const rateLimit = require('express-rate-limit')
Array.prototype.shuffle = function () {
  // Define this once
  return (
    this.map(
      (k, i, o, p = Math.floor(Math.random() * this.length)) =>
        ([o[i], o[p]] = [o[p], o[i]])
    ) && this
  );
};
require("https").globalAgent.options.rejectUnauthorized = false;

//-Database Login-//

mongoose.set("strictQuery", true);

try {
  mongoose.connect(config.mongo).then(logger.system("Mongoose connected."));
} catch (error) {
  logger.error(error);
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
});

//-Alaways use protection!-//

var minifyHTML = require("express-minify-html-terser");
app.use(
  minifyHTML({
    override: true,
    exception_url: false,
    htmlMinifier: {
      removeComments: true,
      collapseWhitespace: true,
      collapseBooleanAttributes: true,
      removeAttributeQuotes: true,
      removeEmptyAttributes: true,
      minifyJS: true,
    },
  })
);

//-Passport Discord-//

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (obj, done) {
  done(null, obj);
});

var scopes = ["identify", "guilds.join"];
var prompt = "consent";

passport.use(
  new Strategy(
    {
      clientID: config.bot.id,
      clientSecret: config.bot.secret,
      callbackURL: config.bot.redirect || `${config.bot.redirect}/joinSupport`,
      scope: scopes,
      prompt: prompt,
    },
    function (accessToken, _refreshToken, profile, done) {
      process.nextTick(function () {
        profile.tokens = {
          accessToken,
        };
        return done(null, profile);
      });
    }
  )
);

app.use(
  session({
    store: new SQLiteStore(),
    secret: "SupersercetratioskklnkWiOndy",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());

app.use(passport.session());

let normalScopes = ["identify"];

app.get("/auth/login", (req, res, next) =>
  passport.authenticate("discord", {
    scope: normalScopes,
    prompt: prompt,
    callbackURL: config.bot.redirect,
    state: req.query.from || "/",
  })(req, res, next)
);

app.get("/auth/login/joinSupport", (req, res, next) =>
  passport.authenticate("discord", {
    scope: scopes,
    prompt: prompt,
    callbackURL: `${config.bot.redirect}/joinSupport`,
    state: req.query.from || "/",
  })(req, res, next)
);

app.get(
  "/auth/callback",
  passport.authenticate("discord", {
    failureRedirect: "/",
  }),
  function (req, res) {
    res.redirect(req.query.state || "/");
  }
);

app.get(
  "/auth/callback/joinSupport",
  passport.authenticate("discord", {
    failureRedirect: "/",
    scope: scopes,
    prompt: prompt,
    callbackURL: `${config.bot.redirect}/joinSupport`,
  }),
  function (req, res) {
    const client = global.client;

    try {
      fetch(
        `https://discord.com/api/v10/guilds/${config.guilds.main}/members/${req.user.id}`,
        {
          method: "PUT",
          body: JSON.stringify({
            access_token: req.user.accessToken,
          }),
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bot ${client.token}`,
          },
        }
      );
    } catch {}

    res.redirect(req.query.state || "/");
  }
);

app.get("/info", async (req, res) => {
  return res.json(req.user);
});

app.get("/auth/logout", function (req, res) {
  req.logout(() => {
    res.redirect(req.query.from || "/");
  });
});

//-bot-//

app.get("/", async (req, res) => {
  const client = global.client;
  let bots = await global.botModel.find({
    approved: true,
  });

  for (let i = 0; i < bots.length; i++) {
    const BotRaw = await client.users.fetch(bots[i].id);
    bots[i].name = BotRaw.username;
    bots[i].avatar = BotRaw.avatar;
    bots[i].name = bots[i].name.replace(
      /([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g,
      ""
    );
    bots[i].tags = bots[i].tags.join(", ");
  }

  res.render("index.ejs", {
    bot: req.bot,
    bots: bots.shuffle(),
    user: req.user || null,
  });
});

app.get("/bots", async (req, res) => {
  const client = global.client;
  let bots = await global.botModel.find({
    approved: true,
  });

  for (let i = 0; i < bots.length; i++) {
    const BotRaw = await client.users.fetch(bots[i].id);

    bots[i].name = BotRaw.username;
    bots[i].avatar = BotRaw.avatar;
    bots[i].name = bots[i].name.replace(
      /([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g,
      ""
    );
    bots[i].tags = bots[i].tags.join(", ");
  }

  res.render("botlist/bots.ejs", {
    bot: req.bot,
    bots: bots.shuffle(),
    user: req.user || null,
  });
}); //Removing end point
app.get("/explore", async (req, res) => {
  res.redirect("/");
});

app.get("/bots/new", checkAuth, async (req, res) => {
  res.render("botlist/add.ejs", {
    bot: global.client,
    tags: global.config.tags,
    user: req.user || null,
  });
});

app.post("/bots/new", checkAuth, async (req, res) => {
  const client = global.client;
  const logs = client.channels.cache.get(config.channels.weblogs);
  let data = req.body;

  if (!data) return res.redirect("/");

  if (
    await global.botModel.findOne({
      id: data.id,
    })
  )
    return res.status(409).json({
      message: "This application has already been added to our site.",
    });

  try {
    await client.users.fetch(data.id);
  } catch (err) {
    return res.status(400).json({
      message: "This is not a real application on Discord.",
    });
  }

  const bot = await client.users.fetch(data.id);

  if (bot.bot === false) {
    return res.status(400).json({
      message:
        "You tried to add a user account to the site, you need to add a BOT ID.",
    });
  }

  await global.botModel.create({
    id: data.id,
    prefix: data.prefix,
    owner: req.user.id,
    desc: data.desc,
    shortDesc: data.shortDesc,
    submittedOn: Date.now(),
    views: 0,
    tags: data.tags,
    invite: data.invite,
    support: data.support || null,
    github: data.github || null,
    website: data.website || null,
    donate: data.donate || null,
  });

  const date = new Date();
  const addEmbed = new EmbedBuilder()
    .setTitle("Bot Added")
    .setDescription(
      "<:add:946594917596164136> " +
        bot.tag +
        " has been submitted to Universe List."
    )
    .setColor("Blue")
    .addFields({
      name: "Bot",
      value: `[${bot.tag}](https://universe-list.xyz/bots/${bot.id})`,
      inline: true,
    })
    .addFields({
      name: "Owner",
      value: `[${req.user.username}](https://universe-list.xyz/users/${req.user.id})`,
      inline: true,
    })
    .addFields({
      name: "Date",
      value: `${date.toLocaleString()}`,
      inline: true,
    })
    .setFooter({
      text: "Add Logs - Universe List",
      iconURL: `${global.client.user.displayAvatarURL()}`,
    });
  logs.send({
    content: `<@${req.user.id}> | <@&941896554736934934>`,
    embeds: [addEmbed],
  });

  return res.redirect(
    `/bots/${data.id}?success=true&body=Your bot was added successfully.`
  );
});

app.get("/bots/:id/invite", async (req, res) => {
  const id = req.params.id;
  const bot = await global.botModel.findOne({
    id: id,
  });
  if (!bot) return res.status(404).redirect("/404");

  if (!bot.invite) {
    return res.redirect(
      `https://discord.com/oauth2/authorize?client_id=${id}&scope=bot%20applications.commands&permissions=0&response_type=code`
    );
  }

  return res.redirect(bot.invite);
});

app.get("/bots/:id/edit", checkAuth, async (req, res) => {
  const client = global.client;
  const config = global.config;
  const id = req.params.id;

  const bot = await global.botModel.findOne({
    id: id,
  });
  if (!bot) return res.redirect("/404");

  const guild = global.client.guilds.cache.get(global.config.guilds.main);
  const member = guild.members.cache.get(req.user.id);

  if (
    bot.owner.includes(req.user.id) ||
    member.roles.cache.some((role) => role.id === config.roles.bottester)
  ) {
    const BotRaw = (await client.users.fetch(id)) || null;
    bot.name = BotRaw.username;
    bot.avatar = BotRaw.avatar;

    const guild = global.client.guilds.cache.get(global.config.guilds.main);
    const member = guild.members.cache.get(req.user.id);

    res.render("botlist/edit.ejs", {
      bot: bot,
      tags: global.config.tags,
      user: req.user || null,
      member: member,
    });
  } else {
    return res.redirect("/403");
  }
});

app.post("/bots/:id/edit", checkAuth, async (req, res) => {
  const client = global.client;
  const config = global.config;
  const logs = client.channels.cache.get(config.channels.weblogs);
  const botm = await global.botModel.findOne({
    id: req.params.id,
  });
  let data = req.body;
  if (!data) return res.redirect("/");

  const guild = global.client.guilds.cache.get(global.config.guilds.main);
  const member = guild.members.cache.get(req.user.id);

  if (
    botm.owner.includes(req.user.id) ||
    member.roles.cache.some((role) => role.id === config.roles.bottester)
  ) {
    const bot = await client.users.fetch(req.params.id).catch(() => null);
    if (!bot)
      return res.status(400).json({
        message: "This is not a real application on Discord.",
      });
    botm.id = req.params.id;
    botm.prefix = data.prefix;
    botm.desc = data.desc;
    botm.shortDesc = data.shortDesc;
    botm.tags = data.tags;
    botm.invite = data.invite;
    botm.support = data.support || null;
    botm.github = data.github || null;
    botm.website = data.website || null;
    botm.donate = data.donate || null;
    botm.webhook = data.webhook || null;
    await botm.save();

    const date = new Date();
    const editEmbed = new EmbedBuilder()
      .setTitle("Bot Edited")
      .setDescription(
        ":pencil: " + bot.tag + " has been edited on Universe List."
      )
      .setColor("Yellow")
      .addFields({
        name: "Bot",
        value: `[${bot.tag}](https://universe-list.xyz/bots/${bot.id})`,
        inline: true,
      })
      .addFields({
        name: "Editor",
        value: `[${req.user.username}](https://universe-list.xyz/users/${req.user.id})`,
        inline: true,
      })
      .addFields({
        name: "Date",
        value: `${date.toLocaleString()}`,
        inline: true,
      })
      .setFooter({
        text: "Edit Logs - Universe List",
        iconURL: `${global.client.user.displayAvatarURL()}`,
      });
    logs.send({
      content: `<@${req.user.id}>`,
      embeds: [editEmbed],
    });

    return res.redirect(
      `/bots/${req.params.id}?success=true&body=You have successfully edited your bot.`
    );
  } else {
    return res.redirect("/403");
  }
});

app.get("/certify", checkAuth, async (req, res) => {
  const client = global.client;

  const bots = await global.botModel.find({ owners: { $all: [req.user.id] } });

  const guild = global.client.guilds.cache.get(global.config.guilds.main);
  const user = guild.members.cache.get(req.user.id);

  res.render("botlist/certify.ejs", {
    user: user || null,
    bots,
  });
});

app.post("/certify", checkAuth, async (req, res) => {
  const botDb = await global.botModel.findOne({ id: req.body.bot });
  const user = await global.userModel.findOne({ id: req.user.id });

  if (!botDb) {
    return res.status(404).render("error.ejs", {
      user,
      code: 404,
      message: "Couldn't find the bot on our list.",
    });
  }

  if (!botDb.owners.includes(req.user.id)) {
    return res.status(403).render("error.ejs", {
      user,
      code: 403,
      message: "You don't own this bot.",
    });
  }

  if (
    !botDb.certifyApplied &&
    !botDb.certified &&
    botDb.servers > 0 &&
    botDb.monthlyVotes >= 50 &&
    (new Date().getTime() - new Date(botDb.submittedOn).getTime()) /
      (1000 * 60 * 60 * 24.0) >=
      16
  ) {
    if (botDb.certifyApplied) {
      return res
        .status(409)
        .json({ message: "You already applied for certification." });
    }

    botDb.certifyApplied = true;
    await botDb.save();

    return res.status(200).json({
      message:
        "Applied for certification! You'll be notified once your application is looked over.",
    });
  } else {
    return res.status(400).render("error.ejs", {
      user,
      code: 400,
      message: "Your bot doesn't meet the requirements for certification.",
    });
  }
});

app.get("/bots/:id/delete", checkAuth, async (req, res) => {
  const client = global.client;
  const config = global.config;
  const id = req.params.id;

  const bot = await global.botModel.findOne({
    id: id,
  });
  if (!bot) return res.redirect("/404");

  const guild = global.client.guilds.cache.get(global.config.guilds.main);
  const member = guild.members.cache.get(req.user.id);

  if (
    bot.owner.includes(req.user.id) ||
    member.roles.cache.some((role) => role.id === config.roles.bottester)
  ) {
    const BotRaw = (await client.users.fetch(id)) || null;
    bot.name = BotRaw.username;
    bot.avatar = BotRaw.avatar;

    const guild = global.client.guilds.cache.get(global.config.guilds.main);
    const member = guild.members.cache.get(req.user.id);

    res.render("botlist/delete.ejs", {
      bot: req.bot,
      id: req.params.id,
      config: config,
      user: req.user || null,
    });
  } else {
    return res.redirect("/403");
  }
});

app.post("/bots/:id/delete", checkAuth, async (req, res) => {
  const client = global.client;
  const config = global.config;
  const logs = client.channels.cache.get(config.channels.weblogs);
  const botm = await global.botModel.findOne({
    id: req.params.id,
  });
  let data = req.body;
  if (!data) return res.redirect("/");

  const guild = global.client.guilds.cache.get(global.config.guilds.main);
  const member = guild.members.cache.get(req.user.id);

  if (
    botm.owner.includes(req.user.id) ||
    member.roles.cache.some((role) => role.id === config.roles.bottester)
  ) {
    const bot = await client.users.fetch(req.params.id).catch(() => null);

    let bot2 = await global.botModel.findOne({
      id: req.params.id,
    });

    const OwnerRaw = await client.users.fetch(bot2.owner);
    bot.ownerName = OwnerRaw.username;

    if (!bot)
      return res.status(400).json({
        message: "This is not a real application on Discord.",
      });

    let guild = client.guilds.cache.get(global.config.guilds.main);
    const kickBot = guild.members.cache.get(bot.id);
    if (kickBot) {
      kickBot.kick("Deleted from Universe List.");
    }
    await botm.delete();

    const date = new Date();
    bot2.reason = req.body.reason;
    const editEmbed = new EmbedBuilder()
      .setTitle("Bot Deleted")
      .setDescription(
        "<:ul_no:946581450600370298> " +
          bot.tag +
          " has been deleted on Universe List."
      )
      .setColor("Red")
      .addFields({
        name: "Bot",
        value: `[${bot.tag}](https://universe-list.xyz/bots/${bot.id})`,
        inline: true,
      })
      .addFields({
        name: "Owner",
        value: `[${bot.ownerName}](https://universe-list.xyz/users/${bot2.owner})`,
        inline: true,
      })
      .addFields({
        name: "Date",
        value: `${date.toLocaleString()}`,
        inline: true,
      })
      .addFields({
        name: "Reason",
        value: `${bot2.reason}`,
        inline: true,
      })
      .setFooter({
        text: "Delete Logs - Universe List",
        iconURL: `${global.client.user.displayAvatarURL()}`,
      });
    logs.send({
      content: `<@${bot2.owner}>`,
      embeds: [editEmbed],
    });
    const owner = global.client.guilds.cache
      .get(global.config.guilds.main)
      .members.cache.get(bot2.owner);
    try {
      owner.send({
        embeds: [editEmbed],
      });
    } catch (e) {
      console.log("Could not DM the user.");
    }

    return res.redirect(
      `/bots/${req.params.id}?success=true&body=You have successfully deleted the bot.`
    );
  } else {
    return res.redirect("/403");
  }
});

app.get("/bots/:id/report", checkAuth, async (req, res) => {
  const client = global.client;
  const config = global.config;
  const id = req.params.id;

  const bot = await global.botModel.findOne({
    id: id,
  });
  if (!bot) return res.redirect("/404");

  const guild = global.client.guilds.cache.get(global.config.guilds.main);
  const member = guild.members.cache.get(req.user.id);

  if (member) {
    const BotRaw = (await client.users.fetch(id)) || null;
    bot.name = BotRaw.username;
    bot.avatar = BotRaw.avatar;

    res.render("botlist/report.ejs", {
      bot: req.bot,
      id: req.params.id,
      config: config,
      user: req.user || null,
    });
  } else {
    return res.redirect("/403");
  }
});

app.post("/bots/:id/report", checkAuth, async (req, res) => {
  const client = global.client;
  const config = global.config;
  const logs = client.channels.cache.get(config.channels.reportlogs);
  const botm = await global.botModel.findOne({
    id: req.params.id,
  });
  let data = req.body;
  if (!data) return res.redirect("/");

  const guild = global.client.guilds.cache.get(global.config.guilds.main);
  const member = guild.members.cache.get(req.user.id);

  if (member) {
    const bot = await client.users.fetch(req.params.id).catch(() => null);

    let bot2 = await global.botModel.findOne({
      id: req.params.id,
    });

    const OwnerRaw = await client.users.fetch(bot2.owner);
    bot.ownerName = OwnerRaw.username;

    if (!bot)
      return res.status(400).json({
        message: "This is not a real application on Discord.",
      });

    const date = new Date();
    bot2.reason = req.body.reason;
    const reportEmbed = new EmbedBuilder()
      .setTitle("Bot Reported")
      .setDescription(
        ":rotating_light: " + bot.tag + " has been reported on Universe List."
      )
      .setColor("fe3c3c")
      .addFields({
        name: "Bot",
        value: `[${bot.tag}](https://universe-list.xyz/bots/${bot.id})`,
        inline: true,
      })
      .addFields({
        name: "Reporter",
        value: `[${req.user.username}](https://universe-list.xyz/users/${req.user.username})`,
        inline: true,
      })
      .addFields({
        name: "Date",
        value: `${date.toLocaleString()}`,
        inline: true,
      })
      .addFields({
        name: "Reason",
        value: `${bot2.reason}`,
        inline: true,
      })
      .setFooter({
        text: "Report Logs - Universe List",
        iconURL: `${global.client.user.displayAvatarURL()}`,
      });
    logs.send({
      content: `<@&${config.roles.bottester}>`,
      embeds: [reportEmbed],
    });

    return res.redirect(
      `/bots/${req.params.id}?success=true&body=You have successfully reported the bot.`
    );
  } else {
    return res.redirect("/403");
  }
});

app.post("/bots/:id/apikey", checkAuth, async (req, res) => {
  let id = req.params.id;
  let bot = await global.botModel.findOne({
    id: id,
  });
  if (!bot) return res.redirect("/");
  if (req.user.id !== bot.owner) return res.redirect("/");

  let data = req.body;

  function genApiKey(options = {}) {
    let length = options.length || 5;
    let string =
      "abcdefghijklmnopqrstuwvxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
    let code = "";
    for (let i = 0; i < length; i++) {
      let random = Math.floor(Math.random() * string.length);
      code += string.charAt(random);
    }
    return code;
  }
  bot.apikey = genApiKey({
    length: 20,
  });
  await bot.save();
  return res.redirect(
    `https://universe-list.xyz/bots/${id}/edit?success=true&body=You have successfully generated a new token.`
  );
});

app.post("/bots/:id/vote", checkAuth, async (req, res) => {
  let bot = await global.botModel.findOne({
    id: req.params.id,
  });
  if (!bot)
    return res.status(404).json({
      message: "This bot was not found on our site.",
    });
  let x = await global.voteModel.findOne({
    user: req.user.id,
    bot: req.params.id,
  });
  if (x) {
    const vote = canUserVote(x);
    if (!vote.status)
      return res.redirect(
        `/bots/${req.params.id}/vote?error=true&body=Please wait ${vote.formatted} before you can vote again.`
      );
    await x.remove().catch(() => null);
  }

  await global.voteModel.create({
    bot: req.params.id,
    user: req.user.id,
    date: Date.now(),
    time: 43200000,
  });
  await global.botModel.findOneAndUpdate(
    {
      id: req.params.id,
    },
    {
      $inc: {
        votes: 1,
      },
    }
  );
  const BotRaw = await global.client.users.fetch(bot.id).catch(() => ({
    username: "Unknown Bot",
    discriminator: "0000",
    avatar: "",
  }));
  bot.name = BotRaw.username;
  bot.discriminator = BotRaw.discriminator;
  bot.avatar = BotRaw.avatar;

  const logs = global.client.channels.resolve(global.config.channels.weblogs);
  const date = new Date();
  const votedEmbed = new EmbedBuilder()
    .setTitle("Bot Voted")
    .setDescription(
      `<:vote:1043639183991898203> ${bot.name}#${bot.discriminator} has been voted on Universe List.`
    )
    .setColor("#7289da")
    .addFields(
      {
        name: "Bot",
        value: `[${bot.name}#${bot.discriminator}](https://universe-list.xyz/bots/${bot.id})`,
        inline: true,
      },
      {
        name: "Voter",
        value: `[${req.user.username}](https://universe-list.xyz/users/${req.user.id})`,
        inline: true,
      },
      {
        name: "Date",
        value: `${date.toLocaleString()}`,
        inline: true,
      }
    )
    .setFooter({
      text: "Vote Logs - Universe List",
      iconURL: global.client.user.displayAvatarURL(),
    });
  if (logs)
    logs
      .send({
        embeds: [votedEmbed],
      })
      .catch(() => null);

  return res.redirect(
    `/bots/${req.params.id}?success=true&body=You voted successfully. You can vote again after 12 hours.`
  );
});

app.get("/bots/:id/vote", checkAuth, async (req, res) => {
  let bot = await global.botModel.findOne({
    id: req.params.id,
  });
  if (!bot)
    return res.status(404).json({
      message: "This bot was not found on our site.",
    });
  let user = await global.userModel.findOne({
    id: req.user.id,
  });
  if (!user)
    await global.userModel.create({
      id: req.user.id,
    });

  const BotRaw = (await global.client.users.fetch(bot.id)) || null;
  bot.name = BotRaw.username;
  bot.discriminator = BotRaw.discriminator;
  bot.avatar = BotRaw.avatar;

  res.render("botlist/vote.ejs", {
    bot: bot,
    user: req.user || null,
  });
});

app.get("/bots/:id/review", checkAuth, async (req, res) => {
  let id = req.params.id;
  const bot = await global.botModel.findOne({
    id: id,
  });

  if (!bot)
    return res.status(404).json({
      message: "This bot could not be found in our site.",
    });

  if (bot.owner === req.user.id)
    return res.status(400).json({
      message: "You cannot review your own bot.",
    });

  const BotRaw = (await global.client.users.fetch(bot.id)) || null;
  bot.name = BotRaw.username;
  bot.discriminator = BotRaw.discriminator;
  bot.avatar = BotRaw.avatar;

  res.render("botlist/review.ejs", {
    bot: bot,
    config: global.config,
    user: req.user || null,
  });
});

app.post("/bots/:id/review", checkAuth, async (req, res) => {
  let id = req.params.id;
  const bot = await global.botModel.findOne({
    id,
  });
  if (!bot)
    return res.status(404).json({
      message: "This bot could not be found in our site.",
    });
  if (bot.owner === req.user.id)
    return res.status(400).json({
      message: "You cannot review your own bot.",
    });
  const data = req.body;

  if (
    await global.reviewModel.findOne({
      reviewer: req.user.id,
      botid: req.params.id,
    })
  )
    return res.status(400).json({
      message: "You already have a review for this bot.",
    });
  await global.reviewModel.create({
    reviewer: req.user.id,
    botid: req.params.id,
    rating: data.rating,
    body: data.body,
    date: new Date().toLocaleString(),
  });

  return res.redirect(
    `https://universe-list.xyz/bots/${id}?success=true&body=Your review was successfully added.`
  );
});

app.get("/bots/:id", async (req, res) => {
  let id = req.params.id;
  const client = global.client;
  const reviewsModel = global.reviewModel;
  const bot = await global.botModel.findOne({
    id,
  });
  if (!bot)
    return res.status(404).json({
      message:
        "We could not find this bot on our list, or it may have been deleted.",
    });
  const marked = require("marked");
  const desc = marked.parse(bot.desc);
  const BotRaw = (await client.users.fetch(id)) || null;
  const OwnerRaw = (await client.users.fetch(bot.owner)) || null;
  bot.name = BotRaw.username;
  bot.avatar = BotRaw.avatar;
  bot.discriminator = BotRaw.discriminator;
  bot.tag = BotRaw.tag;
  bot.ownerTag = OwnerRaw.username;
  bot.ownerAvatar = OwnerRaw.avatar;
  bot.tags = bot.tags.join(", ");
  bot.desc = desc;
  bot.flags = BotRaw.flags.bitfield;

  const reviews = await reviewsModel.find({
    botid: bot.id,
  });

  for (let i = 0; i < reviews.length; i++) {
    const ReviewerRaw = await client.users.fetch(reviews[i].reviewer);
    reviews[i].reviewerName = ReviewerRaw.username;
    reviews[i].reviewerAvatar = ReviewerRaw.avatar;
  }

  const guild = global.client.guilds.cache.get(global.config.guilds.main);
  let member = "";

  if (req.user) {
    member = guild.members.cache.get(req.user.id);
  } else {
    member = null;
  }
  res.render("botlist/viewbot.ejs", {
    bot2: req.bot,
    bot: bot,
    user: req.user || null,
    reviews: reviews.shuffle(),
    member: member,
  });
});

app.get("/bots/:id/widget", async (req, res) => {
  let id = req.params.id;
  const client = global.client;
  const bot = await global.botModel.findOne({
    id: id,
  });

  const BotRaw = (await client.users.fetch(id)) || null;
  bot.name = BotRaw.username;
  bot.avatar = BotRaw.avatar;
  bot.discriminator = BotRaw.discriminator;
  bot.tag = BotRaw.tag;

  res.render("botlist/widget.ejs", {
    bot: bot,
    user: req.user || null,
  });
});

//-TAGS-//

app.get("/tags", async (req, res) => {
  res.render("tags.ejs", {
    bottags: global.config.tags.bots,
    servertags: global.config.tags.servers,
    user: req.user || null,
  });
});

app.get("/bots/tags/:tag", async (req, res) => {
  const tag = req.params.tag;
  if (!global.config.tags.bots.includes(tag))
    return res.status(404).json({
      message: "This tag was not found in our database.",
    });
  let data = await global.botModel.find();
  let bots = data.filter((a) => a.approved === true && a.tags.includes(tag));
  if (bots.length <= 0) return res.redirect("/");

  for (let i = 0; i < bots.length; i++) {
    const BotRaw = await global.client.users.fetch(bots[i].id);
    bots[i].name = BotRaw.username;
    bots[i].avatar = BotRaw.avatar;
    bots[i].name = bots[i].name.replace(
      /([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g,
      ""
    );
    bots[i].tags = bots[i].tags.join(", ");
  }

  res.render("botlist/tags.ejs", {
    bots: bots.shuffle(),
    tag: tag,
    user: req.user,
  });
});

app.get("/servers/tags/:tag", async (req, res) => {
  const tag = req.params.tag;
  if (!global.config.tags.bots.includes(tag))
    return res.status(404).json({
      message: "This tag was not found in our database.",
    });

  let data = await global.serverModel.find();
  let servers = data.filter(
    (a) => a.published === true && a.tags.includes(tag)
  );
  if (servers.length <= 0) return res.redirect("/");
  for (let i = 0; i < servers.length; i++) {
    const ServerRaw = await global.sclient.guilds.fetch(servers[i].id);
    servers[i].name = ServerRaw.name;
    servers[i].icon = ServerRaw.iconURL({
      dynamic: true,
    });
    servers[i].memberCount = ServerRaw.memberCount
      .toLocaleString()
      .replace(",", ",");
    servers[i].boosts = ServerRaw.premiumSubscriptionCount;
    servers[i].tags = servers[i].tags.join(", ");
  }

  res.render("servers/tags.ejs", {
    tag: tag,
    user: req.user || null,
    servers: servers.shuffle(),
  });
});

//-API-//

app.get("/api/bots/:id", async (req, res) => {
  const rs = await global.botModel.findOne({
    id: req.params.id,
  });
  if (!rs)
    return res.status(404).json({
      message: "This bot is not in our database.",
    });
  if (!rs.approved)
    return res.status(404).json({
      message: "This bot is not approved yet.",
    });
  const reviews = await global.reviewModel.find(
    {
      botid: req.params.id,
    },
    "-_id -__v"
  );
  const BotRaw = await global.client.users.fetch(rs.id).catch(() => null);
  const OwnerRaw = await global.client.users.fetch(rs.owner).catch(() => null);
  return res.json({
    // This doesn't need to be in another object (i.e: 'final_data')
    id: rs.id,
    username: BotRaw.username,
    discriminator: BotRaw.discriminator,
    avatar: `https://cdn.discordapp.com/avatars/${rs.id}/${BotRaw.avatar}.png`,
    prefix: rs.prefix,
    owner: rs.owner,
    ownerTag: OwnerRaw.tag,
    tags: rs.tags,
    reviewer: rs.reviewer,
    submittedOn: rs.submittedOn,
    approvedOn: rs.approvedOn,
    shortDescription: rs.shortDesc,
    description: rs.desc,
    reviews,

    // Counts
    shards: +rs.shards,
    servers: +rs.servers,
    votes: rs.votes,
    views: rs.views,

    // Links
    reviewer: rs.reviewer,
    banner: rs.banner,
    invite: rs.invite,
    website: rs.website,
    github: rs.github,
    support: rs.support,
  });
});

app.post("/api/bots/:id/", async (req, res) => {
  const key = req.headers.authorization;
  if (!key)
    return res.status(401).json({
      json: "Please provides a API Key.",
    });

  let bot = await global.botModel.findOne({
    apikey: key,
  });
  if (!bot)
    return res.status(404).json({
      message:
        "This bot is not on our list, or you entered an invaild API Key.",
    });
  const servers = req.body.server_count || req.header("server_count");
  const shards = req.body.shard_count || req.header("shard_count");

  if (!servers)
    return res.status(400).json({
      message: "Please provide a server count.",
    });
  if (!shards)
    return res.status(400).json({
      message: "Please provide a shard count.",
    });

  bot.servers = servers.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  bot.shards = shards.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  await bot.save().catch(() => null);
  return res.json({
    message: "Successfully updated.",
  });
});

app.get("/api/bots/:id/voted", async (req, res) => {
  const bot = await global.botModel.findOne({
    id: req.params.id,
  });
  if (!bot)
    return res.status(404).json({
      message: "This bot is not on our list.",
    });
  if (!bot.approved)
    return res.status(400).json({
      message: "This bot is not approved yet.",
    });

  const id = req.query.user;
  if (!id)
    return res.status(400).json({
      message: `You didn't provide 'user' in the query`,
    });
  let user = await global.client.users.fetch(id).catch(() => null);
  if (!user)
    return res.status(400).json({
      message: `The 'user' you provided couldn't be found on Discord.`,
    });
  if (user.bot)
    return res.status(400).json({
      message: `The 'user' id you provided is a Discord bot, bots can't vote.`,
    });

  let x = await global.voteModel.findOne({
    bot: bot.id,
    user: user.id,
  });
  if (!x)
    return res.json({
      voted: false,
    });
  const vote = canUserVote(x);
  if (vote.status)
    return res.json({
      voted: false,
    });
  return res.json({
    voted: true,
    current: parseInt(x.date),
    next: parseInt(x.date) + parseInt(x.time),
  });
});

app.get("/api/bots/:id/votes", async (req, res) => {
  const bot = await global.botModel.findOne({
    id: req.params.id,
  });
  if (!bot)
    return res.status(404).json({
      message: "This bot is not on our list.",
    });
  if (!bot.approved)
    return res.status(400).json({
      message: "This bot is not approved yet.",
    });

  let x = await global.voteModel.find({
    bot: bot.id,
  });
  if (!x || !x.length)
    return res.json({
      status: false,
      message: `There are 0 users waiting to vote for your bot.`,
    });
  return res.json({
    votes: x.map((c) => ({
      user: c.user,
      current: parseInt(c.date),
      next: parseInt(c.date) + parseInt(c.time),
    })),
  });
});

//-ServerList-//

app.get("/servers", async (req, res) => {
  let servers = await global.serverModel.find({
    published: true,
  });
  for (let i = 0; i < servers.length; i++) {
    const ServerRaw = await global.sclient.guilds.fetch(servers[i].id);
    servers[i].name = ServerRaw.name;
    servers[i].icon = ServerRaw.iconURL({
      dynamic: true,
    });
    servers[i].name = servers[i].name.replace(
      /([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g,
      ""
    );
    servers[i].memberCount = ServerRaw.memberCount;
    servers[i].boosts = ServerRaw.premiumSubscriptionCount;
    servers[i].tags = servers[i].tags.join(`, `);
  }

  res.render("servers/index.ejs", {
    bot: req.bot,
    user: req.user || null,
    servers: servers.shuffle(),
  });
});

app.get("/servers/new", checkAuth, async (req, res) =>
  res.redirect(
    "https://discord.com/api/oauth2/authorize?client_id=1018001748020961311&permissions=19473&scope=applications.commands%20bot"
  )
);

app.get("/servers/:id", async (req, res) => {
  const id = req.params.id;

  const server = await global.serverModel.findOne({
    id: id,
  });
  if (!server) return res.redirect("/404");

  if (server.published === false) {
    if (!req.user) return res.redirect("/404?error=503");
    const member = await global.sclient.guilds
      .fetch(server.id)
      .then((guild) => guild.members.fetch(req.user.id));
    if (!member || !member.permissions.has(PermissionFlagsBits.Administrator))
      return res.redirect("/404?error=503");
  }

  server.views = parseInt(server.views) + 1;
  await server.save();

  //-Cleaning Server Desc-//
  const marked = require("marked");
  const desc = marked.parse(server.desc);

  const ServerRaw = (await global.sclient.guilds.fetch(id)) || null;
  const OwnerRaw = await global.sclient.users.fetch(server.owner);
  let allowed = false;
  if (req.user) {
    const guild_member = await global.sclient.guilds
      .fetch(server.id)
      .then((guild) => guild.members.fetch(req.user.id));
    allowed =
      guild_member?.permissions.has(PermissionFlagsBits.Administrator) || false;
  }
  server.name = ServerRaw.name;
  server.icon = ServerRaw.iconURL({
    dynamic: true,
  });
  (server.memberCount = ServerRaw.memberCount.toLocaleString()),
    (server.boosts = ServerRaw.premiumSubscriptionCount);
  server.tags = server.tags.join(", ");
  server.ownerTag = OwnerRaw.tag;
  server.ownerAvatar = OwnerRaw.avatar;
  server.desc = desc;
  server.emojis = ServerRaw.emojis.cache.size;
  res.render("servers/viewserver.ejs", {
    bot: global.client,
    server: server,
    user: req.user,
    allowed: allowed,
  });
});

app.get("/api/servers/:id", async (req, res) => {
  const server = await global.serverModel.findOne({
    id: req.params.id,
  });
  if (!server)
    return res.status(404).json({
      message: `That server is not in the list`,
    });
  if (!server.published)
    return res.status(404).json({
      message: `That server isn't published yet, so you're not able to GET data for it!`,
    });
  const guild = await global.sclient.guilds.fetch(server.id).catch(() => null);
  if (!guild?.available)
    return res.status(500).json({
      message: `I was unable to fetch the information for the server, try again later.`,
    });
  return res.json({
    name: guild.name,
    id: server.id,
    members: guild.memberCount,
    icon: guild.iconURL({
      dynamic: true,
    }),

    invite: server.invite,
    submittedOn: server.date,
    website: server.website,
    owner: server.owner,
    ownerTag: (
      await global.sclient.users.fetch(server.owner).catch(() => ({
        tag: "Unknown User#0000",
      }))
    ).tag,
    tags: server.tags,

    bump: server.bump,
    bumps: server.bumps,
    views: server.views,
    votes: server.votes,

    shortDesc: server.shortDesc,
    description: server.desc,
  });
});

app.get("/servers/:id/join", async (req, res) => {
  const server = await global.serverModel.findOne({
    id: req.params.id,
  });
  if (!server) return res.status(404).redirect("/404");
  if (!server.published)
    return res.send(
      "This server hasn't been published yet, so you cannot join it!"
    );
  if (!server.invite)
    return res.send(
      "This server does not have an invite set, please contact the owner or set one with the /invite command in this guild."
    );
  return res.redirect(server.invite);
});

app.get("/servers/:id/edit", checkAuth, async (req, res) => {
  const id = req.params.id;

  const server = await global.serverModel.findOne({
    id: id,
  });
  if (!server) return res.redirect("/404");

  const member = await global.sclient.guilds
    .fetch(server.id)
    .then((guild) => guild.members.fetch(req.user.id));
  if (!member || !member.permissions.has(PermissionFlagsBits.Administrator)) {
    return res.redirect("/403");
  }

  const ServerRaw = (await global.sclient.guilds.fetch(id)) || null;

  (server.name = ServerRaw.name),
    (server.icon = ServerRaw.iconURL()),
    (server.memberCount = ServerRaw.memberCount);

  res.render("servers/editserver.ejs", {
    bot: req.bot,
    server: server,
    tags: global.config.tags,
    user: req.user,
  });
});

app.post("/servers/:id/edit", checkAuth, async (req, res) => {
  const id = req.params.id;
  const data = req.body;
  const server = await global.serverModel.findOne({
    id: id,
  });
  if (!server) return res.redirect("/404");

  const member = await global.sclient.guilds
    .fetch(server.id)
    .then((guild) => guild.members.fetch(req.user.id));
  if (!member || !member.permissions.has(PermissionFlagsBits.Administrator)) {
    return res.redirect("/403");
  }

  server.shortDesc = data.short_description;
  server.desc = data.long_description;
  server.tags = data.tags;
  server.website = data.website || null;
  server.donate = data.donate || null;
  server.published = true;
  await server.save();

  const ServerRaw = (await global.sclient.guilds.fetch(server.id)) || null;

  server.name = ServerRaw.name;

  if (server.published === false) {
    const logs = global.sclient.channels.cache.get(
      global.config.channels.weblogs
    );
    const date = new Date();
    const publishEmbed = new EmbedBuilder()
      .setTitle("Server Published")
      .setDescription(
        "<:add:946594917596164136> " +
          server.name +
          " has been published to Universe Servers."
      )
      .setColor("Blue")
      .addFields({
        name: "Server",
        value: `[${server.name}](https://universe-list.xyz/servers/${server.id})`,
        inline: true,
      })
      .addFields({
        name: "Owner",
        value: `[${req.user.username}](https://universe-list.xyz/users/${req.user.id})`,
        inline: true,
      })
      .addFields({
        name: "Date",
        value: `${date.toLocaleString()}`,
        inline: true,
      })
      .setFooter({
        text: "Publish Logs - Universe Servers",
        iconURL: `${global.sclient.user.displayAvatarURL()}`,
      });
    logs.send({
      content: `<@${req.user.id}>`,
      embeds: [publishEmbed],
    });
    return res.redirect(
      `/servers/${req.params.id}?success=true&body=Your server was successfully published.`
    );
  } else {
    const logs = global.sclient.channels.cache.get(
      global.config.channels.weblogs
    );
    const date = new Date();
    const editEmbed = new EmbedBuilder()
      .setTitle("Server Edited")
      .setDescription(
        ":pencil: " + server.name + " has been edited on Universe Servers."
      )
      .setColor("Yellow")
      .addFields({
        name: "Server",
        value: `[${server.name}](https://universe-list.xyz/servers/${server.id})`,
        inline: true,
      })
      .addFields({
        name: "Owner",
        value: `[${req.user.username}](https://universe-list.xyz/users/${req.user.id})`,
        inline: true,
      })
      .addFields({
        name: "Date",
        value: `${date.toLocaleString()}`,
        inline: true,
      })
      .setFooter({
        text: "Edit Logs - Universe Servers",
        iconURL: `${global.sclient.user.displayAvatarURL()}`,
      });
    logs.send({
      content: `<@${req.user.id}>`,
      embeds: [editEmbed],
    });
    return res.redirect(
      `/servers/${req.params.id}?success=true&body=Your server was successfully edited.`
    );
  }
});

app.post("/servers/:id/vote", checkAuth, async (req, res) => {
  let server = await global.serverModel.findOne({
    id: req.params.id,
  });
  if (!server)
    return res.status(404).json({
      message: "This server was not found on our site.",
    });
  let x = await global.serverVoteModel.findOne({
    user: req.user.id,
    server: req.params.id,
  });
  if (x) {
    const left = x.time - (Date.now() - x.date),
      formatted = ms(left, {
        long: true,
      });
    if (left > 0)
      return res.status(400).json({
        message: `You can vote again in ${formatted}.`,
      });
    await x.remove().catch(() => null);
  }

  await global.serverVoteModel.create({
    server: req.params.id,
    user: req.user.id,
    date: Date.now(),
    time: 3600000,
  });
  await global.serverModel.findOneAndUpdate(
    {
      id: req.params.id,
    },
    {
      $inc: {
        votes: 1,
      },
    }
  );

  const ServerRaw = (await global.sclient.guilds.fetch(server.id)) || null;
  server.name = ServerRaw.name;
  server.icon = ServerRaw.iconURL();

  const logs = global.sclient.channels.resolve(global.config.channels.weblogs);
  const date = new Date();
  const votedEmbed = new EmbedBuilder()
    .setTitle("Server Voted")
    .setDescription(
      `<:vote:1043639183991898203> ${server.name} has been voted on Universe Servers.`
    )
    .setColor("#7289da")
    .addFields(
      {
        name: "Server",
        value: `[${server.name}](https://universe-list.xyz/servers/${server.id})`,
        inline: true,
      },
      {
        name: "Voter",
        value: `[${req.user.username}](https://universe-list.xyz/users/${req.user.id})`,
        inline: true,
      },
      {
        name: "Date",
        value: `${date.toLocaleString()}`,
        inline: true,
      }
    )
    .setFooter({
      text: "Vote Logs - Universe Servers",
      iconURL: global.sclient.user.displayAvatarURL(),
    });
  if (logs)
    logs
      .send({
        embeds: [votedEmbed],
      })
      .catch(() => null);

  return res.redirect(
    `/servers/${req.params.id}?success=true&body=You voted successfully. You can vote again after 12 hours.`
  );
});

app.get("/servers/:id/vote", checkAuth, async (req, res) => {
  let server = await global.serverModel.findOne({
    id: req.params.id,
  });
  if (!server)
    return res.status(404).json({
      message: "This server was not found on our site.",
    });
  let user = await global.userModel.findOne({
    id: req.user.id,
  });

  if (!user) {
    await global.userModel.create({
      id: req.user.id,
    });
  }

  const ServerRaw = (await global.sclient.guilds.fetch(server.id)) || null;
  server.name = ServerRaw.name;
  server.icon = ServerRaw.iconURL();

  res.render("servers/vote.ejs", {
    server: server,
    user: req.user || null,
  });
});

//-User Pages-//

app.get("/me", checkAuth, async (req, res) => {
  const user = req.user || null;
  let userm = await global.userModel.findOne({
    id: req.user.id,
  });
  user.bio = userm?.bio || "No bio has been set";
  let bots = await global.botModel.find({
    tested: true,
    owner: user.id,
  });
  let servers = await global.serverModel.find({
    published: true,
    owner: req.params.id,
  });
  for (let i = 0; i < servers.length; i++) {
    const ServerRaw = await global.sclient.guilds.fetch(servers[i].id);
    servers[i].name = ServerRaw.name;
    servers[i].icon = ServerRaw.iconURL({
      dynamic: true,
    });
    servers[i].memberCount = ServerRaw.memberCount;
    servers[i].boosts = ServerRaw.premiumSubscriptionCount;
    servers[i].tags = servers[i].tags.join(", ");
  }

  for (let i = 0; i < bots.length; i++) {
    const BotRaw = await global.client.users.fetch(bots[i].id);
    bots[i].name = BotRaw.username;
    bots[i].avatar = BotRaw.avatar;
    bots[i].tags = bots[i].tags.join(", ");
  }
  res.render("user.ejs", {
    bot: req.bot,
    fetched_user: user || null,
    bots: bots,
    servers: servers,
    config: global.config,
    user: user || null,
  });
});

app.get("/users/:id", async (req, res) => {
  let client = global.client;
  let user = (await client.users.fetch(req.params.id)) || null;
  if (user.bot) return res.redirect("/");
  if (!user)
    return res.status(404).json({
      message: "This user was not found on Discord.",
    });
  let userm = await global.userModel.findOne({
    id: req.params.id,
  });
  user.bio = userm?.bio || "This user has no bio set.";
  user.website = userm?.website;
  user.twitter = userm?.twitter;
  user.github = userm?.github;
  let bots = await global.botModel.find({
    owner: req.params.id,
  });
  for (let i = 0; i < bots.length; i++) {
    const BotRaw = await global.client.users.fetch(bots[i].id);
    bots[i].name = BotRaw.username;
    bots[i].avatar = BotRaw.avatar;
    bots[i].tags = bots[i].tags.join(", ");
  }
  let servers = await global.serverModel.find({
    published: true,
    owner: req.params.id,
  });
  for (let i = 0; i < servers.length; i++) {
    const ServerRaw = await global.sclient.guilds.fetch(servers[i].id);
    servers[i].name = ServerRaw.name;
    servers[i].icon = ServerRaw.iconURL({
      dynamic: true,
    });
    servers[i].memberCount = ServerRaw.memberCount;
    servers[i].boosts = ServerRaw.premiumSubscriptionCount;
    servers[i].tags = servers[i].tags.join(", ");
  }

  res.render("user.ejs", {
    bot: req.bot,
    fetched_user: user,
    bots: bots,
    servers: servers,
    config: global.config,
    user: req.user || null,
  });
});

app.get("/users/:id/edit", checkAuth, async (req, res) => {
  const guild = await global.client.guilds.fetch(global.config.guilds.main);
  let user = (await guild.members.fetch(req.params.id)) || null;
  user = user?.user;
  if (user.bot) return res.redirect("/");
  if (!user) {
    res.status(404).json({
      message: "This user was not found on Discord.",
    });
  }
  if (req.user.id !== user.id) return res.redirect("/403");

  let userm = await global.userModel.findOne({
    id: req.params.id,
  });
  user.bio = userm?.bio || "This user has no bio set.";
  user.website = userm?.website;
  user.github = userm?.github;
  user.twitter = userm?.twitter;

  res.render("edituser.ejs", {
    bot: req.bot,
    fetched_user: user,
    user: req.user || null,
  });
});

app.post("/users/:id/edit", checkAuth, async (req, res) => {
  const client = global.client;
  const userm = await global.userModel.findOne({
    id: req.params.id,
  });
  let data = req.body;

  if (!data) {
    return res.redirect("/");
  }

  if (req.user.id !== userm.id) return res.redirect("/403");

  const user = await client.users.fetch(req.params.id).catch(() => null);
  if (!user) {
    return res.status(400).json({
      message: "This is not a real person on Discord.",
    });
  }

  userm.bio = data.bio || null;
  userm.github = data.github || null;
  userm.website = data.website || null;
  userm.twitter = data.twitter || null;
  await userm.save();

  return res.redirect(
    `/users/${req.params.id}?success=true&body=You have successfully edited your profile.`
  );
});

//-Admin Pages-//

app.get("/queue", checkAuth, checkStaff, async (req, res) => {
  const client = global.client;
  let bots = await global.botModel.find({
    tested: false,
  });
  for (let i = 0; i < bots.length; i++) {
    const BotRaw = await client.users.fetch(bots[i].id);
    bots[i].name = BotRaw.username;
    bots[i].tag = BotRaw.tag;
    bots[i].avatar = BotRaw.avatar;
    bots[i].name = bots[i].name.replace(
      /([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g,
      ""
    );
    bots[i].tags = bots[i].tags.join(", ");
  }

  let inprogress = await global.botModel.find({
    inprogress: true,
  });

  for (let i = 0; i < inprogress.length; i++) {
    const IPRaw = await client.users.fetch(inprogress[i].id);
    const ReviewerRaw = await client.users.fetch(inprogress[i].reviewer);
    inprogress[i].tag = IPRaw.tag;
    inprogress[i].name = IPRaw.username;
    inprogress[i].avatar = IPRaw.avatar;
    inprogress[i].reviewer = ReviewerRaw.username;
    inprogress[i].tags = inprogress[i].tags.join(", ");
  }

  res.render("queue/index.ejs", {
    bot: req.bot,
    bots: bots.shuffle(),
    config: config,
    user: req.user || null,
    inprogress: inprogress,
  });
});

app.get("/bots/:id/approve", checkAuth, checkStaff, async (req, res) => {
  const config = global.config;
  let bot = await global.botModel.findOne({
    id: req.params.id,
  });
  if (!bot)
    return res.status(404).json({
      message: "This application could not be found in our site.",
    });

  res.render("queue/approve.ejs", {
    bot: req.bot,
    id: req.params.id,
    config: config,
    user: req.user || null,
  });
});

app.get("/bots/:id/deny", checkAuth, checkStaff, async (req, res) => {
  let bot = await global.botModel.findOne({
    id: req.params.id,
  });
  if (!bot)
    return res.status(404).json({
      message: "This application could not be found in our site.",
    });

  res.render("queue/deny.ejs", {
    bot: req.bot,
    id: req.params.id,
    config: config,
    user: req.user || null,
  });
});

app.post("/bots/:id/deny", checkAuth, checkStaff, async (req, res) => {
  const config = global.config;
  const logs = global.client.channels.cache.get(config.channels.weblogs);
  const BotRaw = await global.client.users.fetch(req.params.id);
  let bot = await global.botModel.findOne({
    id: req.params.id,
  });

  if (!bot)
    return res.status(404).json({
      message: "This application could not be found in our site.",
    });

  if (bot.approved === true) {
    return res.status(400).json({
      message: "This bot is already approved on Universe List.",
    });
  }

  if (bot.denied === true) {
    return res.status(400).json({
      message: "This bot is already denied on Universe List.",
    });
  }

  const OwnerRaw = (await global.client.users.fetch(bot.owner)) || null;

  bot.tag = BotRaw.tag;
  bot.denied = true;
  bot.tested = true;
  bot.inprogress = false;
  bot.ownerName = OwnerRaw.username;
  bot.reason = req.body.reason;
  bot.deniedOn = Date.now();
  const date = new Date();

  await bot.delete();

  const denyEmbed = new EmbedBuilder()
    .setTitle("Bot Denied")
    .setDescription(
      "<:no:946581450600370298> " +
        bot.tag +
        " has been denied on Universe List."
    )
    .setColor("Red")
    .addFields({
      name: "Bot",
      value: `[${bot.tag}](https://universe-list.xyz/)`,
      inline: true,
    })
    .addFields({
      name: "Owner",
      value: `[${bot.ownerName}](https://universe-list.xyz/users/${bot.owner})`,
      inline: true,
    })
    .addFields({
      name: "Reviewer",
      value: `[${req.user.username}](https://universe-list.xyz/users/${req.user.id})`,
      inline: true,
    })
    .addFields({
      name: "Reason",
      value: `${bot.reason}`,
      inline: true,
    })
    .addFields({
      name: "Date",
      value: `${date.toLocaleString()}`,
      inline: true,
    })
    .setFooter({
      text: "Deny Logs - Universe List",
      iconURL: `${global.client.user.displayAvatarURL()}`,
    });
  logs.send({
    content: `<@${bot.owner}>`,
    embeds: [denyEmbed],
  });
  const owner = global.client.guilds.cache
    .get(global.config.guilds.main)
    .members.cache.get(bot.owner);
  try {
    owner.send({
      embeds: [denyEmbed],
    });
  } catch (e) {
    console.log("Could not DM the user.");
  }
  const channelName = `${BotRaw.username}-${BotRaw.discriminator}`;
  let guild = global.client.guilds.cache.get(global.config.guilds.testing);
  const kickBot = guild.members.cache.get(bot.id);
  kickBot.kick({
    reason: "Denied on Universe List.",
  });
  let channel = guild.channels.cache.find(
    (c) => c.name == channelName.toLowerCase().replace(" ", "-")
  );
  if (channel) channel.delete();
  return res.redirect(
    `/queue?success=true&body=The bot was successfully denied.`
  );
});

app.post("/bots/:id/testing", checkAuth, checkStaff, async (req, res) => {
  let bot = await global.botModel.findOne({
    id: req.params.id,
  });
  let client = global.client;

  if (!bot)
    return res.status(404).json({
      message: "This application could not be found in our site.",
    });
  const LogRaw = (await client.users.fetch(bot.id)) || null;
  bot.inprogress = true;
  bot.tested = true;
  bot.reviewer = req.user.id;
  await bot.save();

  res.redirect(
    `https://discord.com/oauth2/authorize?client_id=${bot.id}&scope=bot&permissions=0&guild_id=${global.config.guilds.testing}`
  );
  let guild = client.guilds.cache.get(global.config.guilds.testing);
  let channel = await guild.channels.create({
    name: `${LogRaw.username}-${LogRaw.discriminator}`,
    reason: `Testing channel for ${LogRaw.tag}.`,
    parent: global.config.channels.testingcategory,
  });
  const embed = new EmbedBuilder()
    .setTitle("New Testing Session")
    .setDescription(
      `Welcome to your new testing session for ${LogRaw}.\nYou may now begin testing this bot. Any questions? View the queue page or ask an admin.`
    )
    .addFields({
      name: "Bot Prefix",
      value: `${bot.prefix}`,
    })
    .setFooter({
      text: "Testing Session - Universe List",
      iconURL: `${global.client.user.displayAvatarURL()}`,
    });
  const row = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setURL(`https://universe-list.xyz/queue`)
      .setLabel("View Queue")
      .setStyle(ButtonStyle.Link)
  );
  await channel.send({
    content: `<@${req.user.id}>`,
    embeds: [embed],
    components: [row],
  });
});
app.use("/bots/:id/status", checkAuth, checkStaff, async (req, res) => {
  const client = global.client;
  const logs = client.channels.cache.get(config.channels.weblogs);
  const BotRaw = await client.users.fetch(req.params.id);
  let bot = await global.botModel.findOne({
    id: req.params.id,
  });

  if (!bot)
    return res.status(404).json({
      message: "This application could not be found in our site.",
    });

  if (bot.approved === true) {
    return res.status(400).json({
      message: "This bot is already approved on Universe List.",
    });
  }

  if (bot.denied === true) {
    return res.status(400).json({
      message: "This bot is already denied on Universe List.",
    });
  }

  const OwnerRaw = await client.users.fetch(bot.owner);

  if (req.method === "POST") {
    bot.tag = BotRaw.tag;
    bot.approved = true;
    bot.inprogress = false;
    bot.ownerName = OwnerRaw.username;
    bot.approvedOn = Date.now();
    bot.tested = true;
    await bot.save();
    const date = new Date();

    const approveEmbed = new EmbedBuilder()
      .setTitle("Bot Approved")
      .setDescription(
        "<:yes:946581450852016198> " +
          bot.tag +
          " has been approved on Universe List."
      )
      .setColor("Green")
      .addFields({
        name: "Bot",
        value: `[${bot.tag}](https://universe-list.xyz/bots/${bot.id})`,
        inline: true,
      })
      .addFields({
        name: "Owner",
        value: `[${bot.ownerName}](https://universe-list.xyz/users/${bot.owner})`,
        inline: true,
      })
      .addFields({
        name: "Reviewer",
        value: `[${req.user.username}](https://universe-list.xyz/users/${req.user.id})`,
        inline: true,
      })
      .addFields({
        name: "Date",
        value: `${date.toLocaleString()}`,
        inline: true,
      })
      .setFooter({
        text: "Approve Logs - Universe List",
        iconURL: `${global.client.user.displayAvatarURL()}`,
      });

    logs.send({
      content: `<@${bot.owner}>`,
      embeds: [approveEmbed],
    });
    const owner = global.client.guilds.cache
      .get(global.config.guilds.main)
      .members.cache.get(bot.owner);
    try {
      owner.send({
        embeds: [approveEmbed],
      });
    } catch (e) {
      console.log("Could not DM the user.");
    }
    const mainGuild = client.guilds.cache.get(global.config.guilds.main);
    const ownerRaw = mainGuild.members.cache.get(bot.owner);
    ownerRaw.roles.add(global.config.roles.developer);
    const channelName = `${BotRaw.username}-${BotRaw.discriminator}`;
    let guild = client.guilds.cache.get(global.config.guilds.testing);
    const kickBot = guild.members.cache.get(bot.id);
    kickBot.kick("Approved on Universe List.");
    let channel = guild.channels.cache.find(
      (c) => c.name == channelName.toLowerCase()
    );
    if (channel) channel.delete("This bot was approved on Universe List.");
    return res.redirect(
      `https://discord.com/oauth2/authorize?client_id=${bot.id}&scope=bot&permissions=0&guild_id=${global.config.guilds.main}`
    );
  }
});

//-Other Pages-//

app.get("/discord", (_req, res) =>
  res.redirect("https://discord.gg/PXdJjTF6yS")
);

app.get("/analytics", (_req, res) =>
  res.redirect(
    "https://analytics.umami.is/share/GgNV4PtXH3fBmJB7/Universe%20List"
  )
);

app.get("/bot-reviewer", (_req, res) =>
  res.redirect("https://ishaantek.typeform.com/bot-reviewer")
);

app.get("/github", (_req, res) =>
  res.redirect("https://github.com/ishaantek/UniverseList")
);

app.get("/newbot", (_req, res) =>
  res.redirect("https://universe-list.xyz/bots/new")
);

app.get("/delete", async (req, res) => {
  res.render("botlist/delete.ejs", {
    tags: global.config.tags,
    member: member,
    bot: req.bot,
    id: req.params.id,
    config: config,
    user: req.user || null,
  });
});

app.get("/partners", async (req, res) => {
  res.render("partners.ejs", {
    user: req.user || null,
  });
});

app.get("/team", async (req, res) => {
  res.render("team.ejs", {
    user: req.user || null,
  });
});

app.get("/docs", async (req, res) => {
  res.render("apidocs.ejs", {
    user: req.user,
  });
});

app.get("/terms", async (req, res) => {
  res.render("legal/terms.ejs", {
    user: req.user,
  });
});

app.get("/privacy", async (req, res) => {
  res.render("legal/privacy.ejs", {
    user: req.user,
  });
});

app.get("/bot-requirements", async (req, res) => {
  res.render("legal/bot-requirements.ejs", {
    user: req.user,
  });
});

app.get("/certification", async (req, res) => {
  res.render("legal/certification.ejs", {
    user: req.user,
  });
});

app.get("/invite", async (req, res) => {
  res.render("invite.ejs", {
    user: req.user,
  });
});

app.get("/403", async (req, res) => {
  res.render("errors/403.ejs", {
    user: req.user,
  });
});

//-Error Pages-//
app.all("*", (req, res) => {
  res.status(404);
  res.render("errors/404.ejs", {
    bot: req.bot,
    user: req.user || null,
  });
});

app.all("*", (req, res) => {
  res.status(401);
  res.render("errors/401.ejs", {
    bot: req.bot,
    user: req.user || null,
  });
});

app.all("*", (req, res) => {
  res.status(403);
  res.render("errors/403.ejs", {
    bot: req.bot,
    user: req.user || null,
  });
});

app.listen(config.port, () => {
  logger.system(`Running on port ${config.port}.`);
});

//-Functions-//

function checkAuth(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect(`/auth/login?from=${req.originalUrl}`);
}

function checkStaff(req, res, next) {
  const config = global.config;
  const guild = global.client.guilds.cache.get(global.config.guilds.main);
  const member = guild.members.cache.get(req.user.id);

  if (
    member.roles.cache.some((role) => role.id === config.roles.mod) ||
    member.roles.cache.some((role) => role.id === config.roles.admin)
  ) {
    return next();
  } else {
    return res.render("errors/403.ejs", {
      user: req.user || null,
    });
  }
}

function canUserVote(x) {
  const left = x.time - (Date.now() - x.date),
    formatted = ms(left, {
      long: true,
    });
  if (left <= 0 || formatted.includes("-"))
    return {
      status: true,
    };
  return {
    status: false,
    left,
    formatted,
  };
}

/* function checkKey(req, res, next) {
  const key = req.headers.authorization
  if (!key) return res.status(401).json({ json: "Please provides a API Key" });
  let data = global.userModel
    .findOne({
      id: key,
    })
    .lean()
    .then((rs) => {
      if (!rs)
        return res.status(404).json({
          message: "Invalid API KEY",
        });
      if (rs) return next()
    })
  //redo
  return;
} */
