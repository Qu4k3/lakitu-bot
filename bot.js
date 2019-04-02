// the better discord.js
const { Client } = require("discord.js-commando");
// colors in terminal
const chalk = require("chalk");
// we don't really need this but meh # copy paste
const path = require("path");
// client config
const client = new Client({
  owner: ["147882388347682816"], /* quake as owner */
  commandPrefix: "!",
  disableEveryone: true /* personal preference */
})

// setting up our client
client
  .on("error", err => {
    console.log(chalk.red(err));
  })
  .on("warn", wrn => {
    console.log(chalk.yellow(wrn));
  })
  // optional debug code, not really needed
  //.on("debug", dbg => {
  //  console.log(chalk.gray(dbg));
  //})
  .on("ready", () => {
    console.log(
      chalk.green(
        `Client logged in\nLogged in as ${client.user.username}#${
          client.user.discriminator
        } - ${client.user.id}`
      )
    );
  })
  .on("disconnect", () => {
    console.log(chalk.yellow("Client disconnected!"));
  })
  .on("reconnecting", () => {
    console.log(chalk.yellow("Client attempting to reconnect..."));
  });

// setup our commands
// will look in the commands folder and get commands in the folder labeled core
// all the commands are just .js files
// typically you have each command in it's own .js file
client.registry
  .registerGroup("core", "Core")
  .registerDefaults()
  .registerCommandsIn(path.join(__dirname, "commands"));

client.login(process.env.TOKEN);