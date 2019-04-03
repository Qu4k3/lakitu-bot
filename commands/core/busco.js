const { Command } = require("discord.js-commando");
const config = require("./../../config.json");

module.exports = class BuscoCommand extends Command {
  constructor(client) {
    super(client, {
      name: "busco",
      group: "core",
      memberName: "busco",
      description: "Añade o quita el rol de `busco-clan`",
      examples: ["busco"],
      guildOnly: true
    });
  }
  
  async run(msg, args) {
    let role = msg.guild.roles.find(role => role.name === "busco-clan");
    // could do a ternary here but i opt for readability
    if (!msg.member.roles.has(role.id)) {
      msg.member.addRole(role);
      msg.reply({
          embed: {
            color: config.color,
            description: "Se te ha añadido el rol de **busco-clan**, ahora tienes acceso a <#405031498496868372>."
          }
        });
    } else {
      msg.member.removeRole(role);
      msg.reply({
          embed: {
            color: config.color,
            description: "Se te ha quitado el rol de **busco-clan**."
          }
        });
    }
  }
};
