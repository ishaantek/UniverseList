const { cleanCode, splitMessageRegex } = require("visa2discord")
const { EmbedBuilder } = require("discord.js")
const {
  inspect
} = require(`util`);
module.exports = {

    name: "eval",
    description: "Evaluates Javascript code in a command.",
    async run(client, message, args) {
        if (!global.config.developers.includes(message.author.id)) return null; 
        if (!args[0])
            return message.reply({
              content: `<:no:946581450600370298> You must provide a code to evaluate.`,
            });
        const code = args.join(" ");
        if (args.includes(`token`))
        return message.reply({
          content: `Apologies, but you won't be able to acquire the bot token using the eval command. Access to such information is restricted for security reasons.`,
        });
      //get the evaled content
        try {
      let evaled;
      evaled = await eval(code);
      //make string out of the evaluation
      let string = cleanCode(inspect(evaled));
      //if the token is included return error
      if (string.includes(client.token))
        return message.reply({
          content: `Apologies, but you won't be able to acquire the bot token using the eval command. Access to such information is restricted for security reasons.`,
        });
      //define queueembed
      let evalEmbed = new EmbedBuilder()
        .setTitle(`${client.user.username} | Evaluation`)
        .setColor("7289da");
           
      //split the description
      const splitDescription = splitMessageRegex(string, {
        maxLength: 2000,
        char: `\n`,
        prepend: ``,
        append: ``,
      });
  
      //For every description send a new embed
      splitDescription.forEach(async (m) => {
   
        //(over)write embed description
        evalEmbed.setDescription(`\`\`\`` + m + `\`\`\``);
        //send embed
        
        message.channel.send({embeds: [evalEmbed]});
        });
           } catch (e) {
     return message.channel.send({
       embeds: [
         new EmbedBuilder()
           .setColor("ffc0cb")
           .setTitle(
             `<:ul_no:946581450600370298> Error | An error occurred`
           )
           .setDescription(`\`\`\`${e}\`\`\``),
       ],
     });
     }
    },
};
