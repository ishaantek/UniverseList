const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("help")
    .setDescription("Replies with information about Universe List, as well as how to add your server."),
  async execute(interaction) {
    const embed = new EmbedBuilder()
      .setTitle("Universe Servers Info & Setup Tips")
      .setDescription(
        "Hey! I'm a bot for [Universe Servers](https://universe-list.xyz/servers).\n\n**Here are some of my commands:**\n`ping`: Check if the bot is alive and running.\n`vote`: Vote for this server on Universe Servers.\n`invite`: Creates an invite for this server on Universe Servers.\n`page`: Provides you with a link to this server's page on Universe Servers.\n\n**How do I publish my server to Universe Servers?**\nSince I am already in this server, it's already in the Universe Servers database.\n`Step #1:` Run the /invite command in this server. *Command can only be used by admins.*\n`Step #2:` Go to the server edit page that is linked in the invite command and edit it. *Only server owners can edit the page.*\nOnce you click the \"Submit\" button on the website, your server will be public on Universe Servers!\n\nNeed any further help? Join our support server by clicking the button below."
      )
      .setFooter({
        text: `Universe List - Help Command`,
        iconURL: `${global.sclient.user.displayAvatarURL()}`,
      });

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setURL(`https://universe-list.xyz/servers`)
        .setLabel("Visit Universe Servers")
        .setStyle(ButtonStyle.Link),
      new ButtonBuilder()
        .setURL(`https://discord.gg/PXdJjTF6yS`)
        .setLabel("Support Server")
        .setStyle(ButtonStyle.Link)
    );

    interaction.reply({ embeds: [embed], components: [row] });
  },
};
