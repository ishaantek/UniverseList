const config = global.config;
const sclient = global.sclient;
const fss = require("node:fs");
const path = require("node:path");
const fs = require("fs");
const { REST } = require("@discordjs/rest");
const { join } = require("path");
const { Collection, Routes } = require("discord.js");
const { Poster, Lists } = require("@maclary/lists");
require("dotenv").config();

sclient.on("guildCreate", async (guild) => {
  const clientId = "1018001748020961311";
  const guildId = guild.id;

  const commands = [];
  const commandsPath = path.join(__dirname, "commands");
  const commandFiles = fss
    .readdirSync(commandsPath)
    .filter((file) => file.endsWith(".js"));

  for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    commands.push(command.data.toJSON());
  }
  const rest = new REST({ version: "10" }).setToken(config.servers.token);

  (async () => {
    try {
      const data = await rest.put(
        Routes.applicationGuildCommands(clientId, guildId),
        { body: commands }
      );
    } catch (error) {
      console.error(error);
    }
  })();
});

sclient.commands = new Collection();
const commandsPath = path.join(__dirname, "commands");
const commandFiles = fss
  .readdirSync(commandsPath)
  .filter((file) => file.endsWith(".js"));

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = require(filePath);
  sclient.commands.set(command.data.name, command);
}

// Universe List Server Count
const clientId = "1018001748020961311";

const lists = [new Lists.UniverseList(clientId, process.env.universekey)];

const poster = new Poster(lists, {
  shardCount: () => sclient.shard?.count ?? 1,
  guildCount: () => sclient.guilds.cache.size,
  userCount: () => sclient.guilds.cache.reduce((a, b) => a + b.memberCount, 0),
  voiceConnectionCount: () => 0,
});

poster.startAutoPost();
poster.stopAutoPost();


//-Events-//

const efiles = fs
  .readdirSync(join(__dirname, "events"))
  .filter((file) => file.endsWith(".js"));
for (const efile of efiles) {
  const event = require(join(__dirname, "events", `${efile}`));
  const eventName = efile.split(".")[0];
  sclient.on(eventName, (...args) => event.run(sclient, ...args));
}
