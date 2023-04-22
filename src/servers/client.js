const config = global.config;
const sclient = global.sclient;
const fss = require("node:fs");
const path = require("node:path");
const fs = require("fs");
const { REST } = require("@discordjs/rest");
const universeList = require("universe-list.js");
const { join } = require("path");
const { Collection, Routes } = require("discord.js");
require("dotenv").config();

sclient.on("ready", () => {
  setInterval(async () => {
    try {
      await universeList.postStats(sclient, process.env.universeKey);
    } catch (error) {
      console.error(`Failed to post stats: ${error}`);
    }
  }, 5 * 60 * 1000); // Five minutes in milliseconds
});

sclient.on("guildCreate", async (guild) => {
  const clientId = config.servers.id;
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

//-Events-//

const efiles = fs
  .readdirSync(join(__dirname, "events"))
  .filter((file) => file.endsWith(".js"));
for (const efile of efiles) {
  const event = require(join(__dirname, "events", `${efile}`));
  const eventName = efile.split(".")[0];
  sclient.on(eventName, (...args) => event.run(sclient, ...args));
}
