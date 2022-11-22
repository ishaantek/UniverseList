const chalk = require("chalk");

module.exports = {
  system(content) {
    console.log(chalk.magenta("[System] ") + chalk.magenta(content));
  },
};
