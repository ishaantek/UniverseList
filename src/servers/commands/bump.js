const {
  SlashCommandBuilder,
  EmbedBuilder,
  ButtonBuilder,
  ActionRowBuilder,
  ButtonStyle,
} = require("discord.js");
const ms = require("ms");
const cooldown = 1800000;

module.exports = {
  data: new SlashCommandBuilder()
    .setName("bump")
    .setDescription("Bumps this server on Universe Servers."),
  async execute(interaction) {
    await interaction.deferReply().catch(() => null);
    let server = await global.serverModel.findOne({ id: interaction.guild.id });
    if (!server)
      return interaction
        .editReply("This server was not found on Universe Servers.\nRun the /help command for more info.")
        .catch(() => null);
    if (!server.published)
      return interaction
        .editReply(
          "This server is not published on Universe Servers yet.\nRun the /help command for more info."
        )
        .catch(() => null);
    let lastDaily = server.bump;
    if (cooldown - (Date.now() - lastDaily) > 0) {
      let timeObj = ms(cooldown - (Date.now() - lastDaily), { long: true });
      return interaction
        .editReply(
          `This server cannot be bumped just yet.\nCome back in ${timeObj}.`
        )
        .catch(() => null);
    } else {
      server.bump = new Date().getTime();
      server.bumps++;
      await server.save().catch(() => null);
      const logs = global.sclient.channels.resolve(
        global.config.channels.weblogs
      );
      const date = new Date();
      const votedEmbed = new EmbedBuilder()
        .setTitle("Server Bumped")
        .setDescription(
          `:small_red_triangle: ${interaction.guild.name} has been bumped on Universe Servers.`
        )
        .setColor("#7289da")
        .addFields(
          {
            name: "Server",
            value: `[${interaction.guild.name}](https://universe-list.xyz/servers/${interaction.guild.id})`,
            inline: true,
          },
          {
            name: "Bumper",
            value: `[${interaction.user.username}](https://universe-list.xyz/users/${interaction.user.id})`,
            inline: true,
          },
          { name: "Date", value: `${date.toLocaleString()}`, inline: true }
        )
        .setFooter({
          text: "Bump Logs - Universe Servers",
          iconURL: `${global.sclient.user.displayAvatarURL()}`,
        });
      if (logs) logs.send({ embeds: [votedEmbed] }).catch(() => null);

      const embed = new EmbedBuilder()
        .setTitle("Successful Bump")
        .setDescription(
          "You have successfully bumped this server to the top of [Universe Servers](https://universe-list.xyz/servers)."
        )
        .setFooter({
          text: `Universe Servers - Bump Command`,
          iconURL: global.sclient.user.displayAvatarURL(),
        });

      const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setURL(`https://universe-list.xyz/servers/${interaction.guild.id}`)
          .setLabel("View Server Page")
          .setStyle(ButtonStyle.Link)
      );

      return interaction
        .editReply({ embeds: [embed], components: [row] })
        .catch(() => null);
    }
  },
};
