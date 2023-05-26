const { ActivityType } = require("discord.js");
const fetch = require("node-fetch");
const votes = require("../../models/serverVote");

module.exports = {
  name: "ready",
  async run(sclient) {
    global.logger.system(`${sclient.user.tag} is online and ready.`);
    sclient.user.setActivity("universe-list.xyz/servers", {
      type: ActivityType.Watching,
    });

    setInterval(async () => {
      const voteModels = await votes.find();
      if (voteModels.length > 0) {
        for (const voteModel of voteModels) {
          const time = voteModel.time - (Date.now() - voteModel.date);
          if (time <= 0) {
            await votes.findOneAndDelete({ server: voteModel.server, user: voteModel.user });
          }
        }
      }
    }, 300000);
  },
};
