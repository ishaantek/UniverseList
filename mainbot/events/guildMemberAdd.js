const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");
const config = global.config;

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
        .resolve(config.channels.generalChat)
        .send(
          `Welcome to Universe List, ${member}! Please read <#${config.channels.rules}> and <#${config.channels.info}>. If you have any questions, feel free to ask in <#${config.channels.support}>. Enjoy your stay!`
        )
        .catch(() => null);
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
            `Welcome to Universe List, one of the leading search and discovery platforms for Discord! We are thrilled to have you join our community.\n\n If you have any questions or concerns, please don't hesitate to contact one of our friendly staff members. We hope you have a wonderful day!\n\n Best regards,\nThe Universe List Team`
          )
          .setFooter({
            text: `© Universe List ${new Date().getFullYear()}, All Rights Reserved.`,
            iconURL: `${global.client.user.displayAvatarURL()}`,
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
