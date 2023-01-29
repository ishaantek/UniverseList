const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");

module.exports = {
  async run(client, member) {
    const id = member.guild.id;
    if (member.user.bot) {
      if (id === global.config.guilds.main)
        member.roles.add(global.config.roles.bots).catch(() => null);
      else if (id === global.config.guilds.testing)
        member.roles.add(global.config.roles.botsintesting).catch(() => null);
    } else {
      if (id !== global.config.guilds.main) return;
      client.channels
        .resolve("941896555718410285")
        .send(
          `<:awesome:1043642149100601435> \`${member.user.username}\` has joined the server!`
        )
        .catch(() => null);
      member.roles.add("1045107993563373578").catch(() => null);
      const embed = new EmbedBuilder()
        .setAuthor({
          name: member.user.tag,
          iconURL: member.user.displayAvatarURL({ dyncamic: true }),
        })
        .setThumbnail(member.user.displayAvatarURL({ dyncamic: true }))
        .setTitle("Member Joined")
        .setDescription(`${member.user} has joined the server.`)
        .addFields({
          name: "Joined Discord",
          value: `<t:${Math.floor(member.user.createdTimestamp / 1000)}:R>`,
          inline: true,
        })
        .addFields({
          name: "Joined Server",
          value: `<t:${Math.floor(member.joinedTimestamp / 1000)}:R>`,
          inline: true,
        })
        .addFields({ name: "Bot", value: `${member.user.bot}`, inline: true })
        .setFooter({
          text: "Universe List - Member Join Logs",
          iconURL: client.user.displayAvatarURL(),
        });
      client.channels.resolve("947636978130751578").send({ embeds: [embed] });

      try {
        const embed = new EmbedBuilder()
          .setTitle("Welcome to Universe List!")
          .setColor("7289da")
          .setDescription(
            "Welcome to Universe List, one of the most powerful bot and server listing site!\n\nIf you have any questions or concerns, please contact an admin.\nHave a wonderful day!"
          )
          .setFooter({
            text: `© Universe List 2023, All Rights Reserved.`,
            iconURL: `https://universe-list.xyz/img/icon.png`,
          });

        let row = new ActionRowBuilder();

        row.addComponents(
          new ButtonBuilder()
            .setURL("https://universe-list.xyz")
            .setLabel("Universe List")
            .setStyle(ButtonStyle.Link)
        );

        row.addComponents(
          new ButtonBuilder()
            .setURL("https://universe-list.xyz/bots/new")
            .setLabel("Add A Bot")
            .setStyle(ButtonStyle.Link)
        );

        member.send({ embeds: [embed], components: [row] });
      } catch (err) {
        console.error("Message failed to send to user: " + err);
      }
    }
  },
};
