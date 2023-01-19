const model = require("../../models/server.js");
const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "guildCreate",
  async run(sclient, guild) {
    let owner = await guild.fetchOwner();
    const d = new Date();

    if (await model.findOne({ id: guild.id })) return;

    let server = await model.create({
      id: guild.id,
      date: d.toLocaleDateString(),
      owner: owner.id,
    });
    const logs = sclient.channels.cache.get(global.config.channels.modlogs);
    const embed = new EmbedBuilder()
      .setTitle("New Guild")
      .setThumbnail(`${guild.iconURL({ dynamic: true })}`)
      .setDescription(
        `**${guild.name}** has invited Universe Servers.`
      )
      .addFields(
        { name: "Guild Owner:", value: `${owner.user.tag} | \`${owner.id}\`` },
        { name: "Member Count:", value: `${guild.memberCount} members` },
        {
          name: "Date:",
          value: `${d.toLocaleDateString()} - ${d.toLocaleTimeString()}`,
        }
      )
      .setFooter({
        text: `Universe Servers - Guild Logs`,
        iconURL: `${global.sclient.user.displayAvatarURL()}`,
      });
    
    
      const welcomeEmbed = new EmbedBuilder()
       .setTitle("Thanks for inviting Universe Servers!")
       .setThumbnail(`${guild.iconURL({ dynamic: true })}`)
       .setDescription(
         `Visit my website at https://universe-list.xyz\n**Got Questions?** Join our support server below and ask our freindly staff team!\n\nhttps://universe-list.xyz `
         `Visit my website at https://universe-list.xyz\n**Got Questions?** Join our support server below and ask our friendly staff team!\n\nhttps://universe-list.xyz `
       )
 
      .setFooter({
        text: `Universe Servers - Guild Logs`,
        iconURL: `${global.sclient.user.displayAvatarURL()}`,
      });
        const channels = guild.channels.cache.filter(channel => channel.type == "text");
        channels.first().send({ embeds: [welcomeEmbed] }).catch(e => console.log(e));
        
    return logs.send({ embeds: [embed] });
  },
};
