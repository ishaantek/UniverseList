const client = global.client;
const config = global.config;
const fs = require("fs");
const { join } = require("path");

const cfiles = fs
  .readdirSync(join(__dirname, "commands"))
  .filter((file) => file.endsWith(".js"));
for (const cfile of cfiles) {
  const command = require(join(__dirname, "commands", `${cfile}`));
  client.commands.set(command.name, command);
  if (command.aliases)
    command.aliases.forEach((alias) => client.aliases.set(alias, command.name));
}

const efiles = fs
  .readdirSync(join(__dirname, "events"))
  .filter((file) => file.endsWith(".js"));
for (const efile of efiles) {
  const event = require(join(__dirname, "events", `${efile}`));
  const eventName = efile.split(".")[0];
  client.on(eventName, (...args) => event.run(client, ...args));
}
