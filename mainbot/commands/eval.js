const {
    getCode,
    clean
} = require("@elara-services/eval-helper");


module.exports = {

    name: "eval",
    description: "Evaluates Javascript code in a command.",
    async run(client, message, args) {
        if (!global.config.developers.includes(message.author.id)) return null; 
        if (!args[0])
            return message.reply({
              content: `<:no:946581450600370298> You must provide a code to evaluate.`,
            });
        const evaled = await getCode({
            code: args.join(" "),
            async: false,
        });
        const code = await clean(eval(evaled), [
            client.token, client.stoken, client.mongo, client.secret
        ]);
        try {
            if (typeof code !== "string") {
              return message.channel.send({
                content: `<:yes:946581450852016198> Successfully evaluated.\n\`\`\`js\n${code}\n\`\`\``,
              });
            } else {
              return message.channel.send({
                content: `<:yes:946581450852016198> Successfully evaluated.\n\`\`\`js\n${code}\n\`\`\``,
              });
            }
        } catch (e) {
            message.channel.send({
              content:
                "<:no:946581450600370298> There was an error during evaluation.\n" +
                e,
            });
        }
    },
};
