const http = require('http');
const express = require('express');
const app = express();
require('dotenv').config();

function checkHttps(req, res, next){
  if(req.get('X-Forwarded-Proto').indexOf("https")!=-1){
    return next()
  } else {
    res.redirect('https://' + req.hostname + req.url);
  }
}
app.all('*', checkHttps);

app.use(express.static('public'));

app.get("/", function (request, response) {
  response.sendFile(__dirname + '/views/index.html');
});

app.get("/", (request, response) => {
  response.sendStatus(200);
});

app.listen(process.env.PORT);

setInterval(() => {
  http.get(`http://${process.env.PROJECT_DOMAIN}.glitch.me/`);
}, 280000);

const Discord = require('discord.js');
const client = new Discord.Client();
const guild = new Discord.Guild();
const config = require("./config.json");

// Everything beneath this comment is a mistake -puck  # :'c

let prefix = config.prefix;

client.on('ready', () => {
  console.log('Lakitu iniciado');
  client.user.setPresence({
       status: "online"       
   });
  client.user.setActivity('');
});

  /* ---------- AUTO BIENVENIDA ---------- */

client.on("guildMemberAdd", (member) => {
    let channel = client.channels.get('565211101457940491');   // 405023265375911936 513088446886313995
    channel.send("¡Bienvenid@ al servidor comunitario de MK8D, <@" + member.id + ">!",{
        embed: {
          color: config.colors.default,
          description: "Por favor, pásate por <#405031085500792833> y por <#471360321504804894> para estar al corriente de cómo funciona el servidor."
        }
     }).then(msg => {
      channel.send({
        embed: {
          color: config.colors.default,
          description: "Para buscar clan tienes habilitado el canal <#405031498496868372>, donde podrás ver clanes que buscan miembros y darte a conocer.\n\nAlternativamente, tienes https://www.mariokartcentral.com/mkc/teams dónde encontrarás también clanes de habla no hispana."
        }
      });      
    });   
});

client.on('message', async message => {

  if (message.author.bot) return;

  if (message.content.indexOf(prefix) !== 0) return;

  const args = message.content.slice(prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();

  /* ---------- !PING ---------- */

  if (command === "ping" && args.length <= 0) {
    let ping = Math.floor(message.client.ping);
    message.channel.send(':ping_pong: Latencia: `' + ping + ' ms.`');
  }
  
  /* ---------- !CREARCLAN ---------- */
  
  if (command === "crearclan" && args.length <= 0) {    
    message.channel.send({
      embed: {
        color: config.colors.default,
        description: "Para dar de alta un clan, tendrás que seguir estos pasos:\n\n**1-** Registrarlo en https://www.mariokartcentral.com/mkc/teams/ (necesitarás crearte una cuenta)\n\n**2-** Mandar un mensaje privado a <@239497463826874368> avisando de la creación de un nuevo clan"
      }
    });     
  }
  
  /* ---------- !BUSCO ---------- */
  
  if (command === "busco" && args.length <= 0) {  
    var role = message.guild.roles.find(role => role.name === "busco-clan");
    var miembros = message.guild.roles.find(role => role.name === "Miembros");
    var roles = message.member.roles
    
    roles = roles.filter(function(item) { 
        return item !== miembros
    })
    
    if(message.member.roles.has(role.id)){
      message.member.removeRole(role);
        message.channel.send({
          embed: {
            color: config.colors.success,
            description: "Se te ha quitado el rol de **busco-clan**."
          }
        });
    } else {
       message.member.addRole(role);
       message.member.removeRoles(roles); // salvo miembros
       message.channel.send({
          embed: {
            color: config.colors.success,
            description: "Se te ha añadido el rol de **busco-clan**, ahora tienes acceso a <#405031498496868372>."
          }
        }).then(msg => {
      message.channel.send({
        embed: {
          color: config.colors.default,
          description: "Se han quitado tus roles anteriores"
        }
      });      
    });  
    }       
  } 
  
  /* ---------- !QUITAR ---------- */
  
  if (command === "quitar" && args.length <= 0) {  
    var mute = message.guild.roles.find(role => role.name === "mute");
    var miembros = message.guild.roles.find(role => role.name === "Miembros");
    var roles = message.member.roles
    
    roles = roles.filter(function(item) { 
        return item !== miembros
    })
    
    if(message.member.roles.has(mute.id)){
        message.channel.send({
          embed: {
            color: config.colors.warning,
            description: "El estado de **mute** no te permite usar este comando."
          }
        });
    } else {
       message.member.removeRoles(roles);
       message.channel.send({
          embed: {
            color: config.colors.success,
            description: "Se te han quitado todos tus roles anteriores"
          }
        });  
    }       
  } 
  
  /* ---------- !MUTE ---------- */
  
  if (command === "mute" && args.length == 1) {  
    if(message.member.roles.find(r => r.name === "Staff") || message.member.roles.find(r => r.name === "Mods")){
      let mentioned = message.mentions.members.first();
      
      var mute = mentioned.guild.roles.find(role => role.name === "mute");
      var miembros = mentioned.guild.roles.find(role => role.name === "Miembros");
      
      if(mentioned.roles.has(mute.id)){
        mentioned.addRole(miembros);
        mentioned.removeRole(mute);
          message.channel.send({
            embed: {
              color: config.colors.default,
              description: "Se te ha quitado el estado de **mute**, ya puedes escribir"
            }
          });
      } else {
         mentioned.addRole(mute);
            mentioned.removeRole(miembros);
            message.channel.send({
              embed: {
                color: config.colors.default,
                description: "<@" + mentioned.id + ">, pasas a tener estado de **mute**\nNo podrás escribir hasta que un moderador te lo quite"
              }
            });  
        } 
    }else {
        message.channel.send({
          embed: {
            color: config.colors.warning,
            description: "No tienes los permisos necesarios para usar este comando."
          }
        })
      }
  } 
  
  /* ---------- !LIDER ---------- */
  
  if (command === "lider" && args.length == 1) { 
    
    var lider = message.guild.roles.find(role => role.name === "Lider");
    var rep = message.guild.roles.find(role => role.name === "Representantes de clan");
    
    let mentioned = message.mentions.members.first();
    
    var lidRepArray = ['464068391758462978', '405031301419368459'];
    
    if(!mentioned.roles.has(lider.id)){
    
      if(message.member.roles.find(r => r.name === "Staff") || message.member.roles.find(r => r.name === "Mods")){
          mentioned.addRoles(lidRepArray);
          message.channel.send({
            embed: {
              color: config.colors.success,
              description: "Se ha añadido el rol de **Lider** y **Representantes de clan** a <@" + mentioned.id + ">."
            }
          });
        } else {
          message.channel.send({
            embed: {
              color: config.colors.warning,
              description: "No tienes los permisos necesarios para usar este comando."
            }
          })
        }
    } else {
      if(message.member.roles.find(r => r.name === "Staff") || message.member.roles.find(r => r.name === "Mods")){
          mentioned.removeRoles(lidRepArray);
          message.channel.send({
            embed: {
              color: config.colors.success,
              description: "Se eliminado el rol de **Lider** y **Representantes de clan** a <@" + mentioned.id + ">."
            }
          });
        } else {
          message.channel.send({
            embed: {
              color: config.colors.warning,
              description: "No tienes los permisos necesarios para usar este comando."
            }
          })
        }
    }
  }
  
  /* ---------- !REP ---------- */
  
  if (command === "rep" && args.length == 1) { 
    
    var rep = message.guild.roles.find(role => role.name === "Representantes de clan");
    var lider = message.guild.roles.find(role => role.name === "Lider");
    var miembros = message.guild.roles.find(role => role.name === "Miembros");
    var busco = message.guild.roles.find(role => role.name === "busco-clan");    
    
    let mentioned = message.mentions.members.first();
    
    var roles = mentioned.roles
    /*
    var clan = roles.filter(function(item) { 
        return item.id !== (miembros || lider || rep || busco)
    })
    
    console.log(clan)
    
    var maxRep = clan.filter(member => { 
        return member.roles.find(clan.id);
    }).map(member => {
        return member.user.username;
    }) */   
    
    if(!mentioned.roles.has(rep.id)){
    
      if(message.member.roles.find(r => r.name === "Staff") || message.member.roles.find(r => r.name === "Mods") || message.member.roles.find(r => r.name === "Lider")){
          mentioned.addRole(rep).then(
          message.channel.send({
            embed: {
              color: config.colors.success,
              description: "Se ha añadido el rol de **Representantes de clan** a <@" + mentioned.id + ">."
            }
          })/*.then(msg => {
              message.channel.send({
                embed: {
                  color: config.colors.default,
                  description: "Representantes actuales del clan: " + maxRep.join("\n")
                }
              });      
            })*/
          )
        } else {
          message.channel.send({
            embed: {
              color: config.colors.warning,
              description: "No tienes los permisos necesarios para usar este comando."
            }
          })
        }
      
    } else {
      
      if(message.member.roles.find(r => r.name === "Staff") || message.member.roles.find(r => r.name === "Mods") || message.member.roles.find(r => r.name === "Lider")){
          mentioned.removeRole(rep).then(
          message.channel.send({
            embed: {
              color: config.colors.success,
              description: "Se ha eliminado el rol de **Representantes de clan** a <@" + mentioned.id + ">."
            }
          })
          /*.then(msg => {
              message.channel.send({
                embed: {
                  color: config.colors.default,
                  description: "Representantes actuales del clan: **array.length / 3**"
                }
              });      
            })*/
          )
        } else {
          message.channel.send({
            embed: {
              color: config.colors.warning,
              description: "No tienes los permisos necesarios para usar este comando."
            }
          })
        }
      
    }
      
  }
  
  /* ---------- !CLAN ---------- */
  
  if (command === "clan" && args.length == 1) { 
    
    var rep = message.guild.roles.find(role => role.name === "Representantes de clan");
    var lider = message.guild.roles.find(role => role.name === "Lider");
    var miembros = message.guild.roles.find(role => role.name === "Miembros");
    var busco = message.guild.roles.find(role => role.name === "busco-clan");    
    
    let mentioned = message.mentions.members.first();
    
    lider, rep, "rol de clan", miembros, busco-clan
    
    var repRoles = message.roles
    var mentionedRoles = mentioned.roles
    
    var clan = repRoles.filter(function(item) { 
        return item !== miembros +"‌‌ "
    })
    
    var clan = mentionedRoles.filter(function(item) { 
        return item !== miembros
    })
    
    console.log(clan) 
    
    if(!mentioned.roles.has(rep.id)){
    
      if(message.member.roles.find(r => r.name === "Staff") || message.member.roles.find(r => r.name === "Mods") || message.member.roles.find(r => r.name === "Lider") || message.member.roles.find(r => r.name === "Representantes de clan")){
          mentioned.addRole(clan).then(
            message.channel.send({
              embed: {
                color: config.colors.success,
                description: "Se ha añadido el rol de <@" + clan.id + "> a <@" + mentioned.id + ">."
              }
            })
          )
        } else {
          message.channel.send({
            embed: {
              color: config.colors.warning,
              description: "No tienes los permisos necesarios para usar este comando."
            }
          })
        }
      
    } else {
      
      if(message.member.roles.find(r => r.name === "Staff") || message.member.roles.find(r => r.name === "Mods") || message.member.roles.find(r => r.name === "Lider") || message.member.roles.find(r => r.name === "Representantes de clan")){
          mentioned.removeRole(rep).then(
            message.channel.send({
              embed: {
                color: config.colors.success,
                description: "Se ha eliminado el rol de <@" + clan.id + "> a <@" + mentioned.id + ">."
              }
            })
          )
        } else {
          message.channel.send({
            embed: {
              color: config.colors.warning,
              description: "No tienes los permisos necesarios para usar este comando."
            }
          })
        }
      
    }
      
  }
  
  /* ---------- !LAKITU ---------- */
  
  if (command === "lakitu" && args.length <= 0) {       
    message.channel.send({
      embed: {
        color: config.colors.default,
        "fields": [
          {       
            "name": "Líderes de clan",
            "value": "**!rep** _@usuario_: Añadir o quitar reps del clan al que pertenece"
          },
          {
            "name": "Reps de clan",
            "value": "**!clan** _@usuario_: Añadir o quitar rol del clan al que pertenece"
          },
          {
            "name": "Todos los usuarios",
            "value": "**!busco**: Añadir o quitar el rol de **busco-clan**, añadirlo implica quitarse el rol de clan.\n**!quitar**: Quita todos los roles actuales.",
          }
        ]
      }
    });     
  }
  
});

client.login(process.env.TOKEN);