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

client.on("guildMemberAdd", (member) => {
    let channel = client.channels.get('405023265375911936');   // 405023265375911936 513088446886313995
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

  if (command === "ping" && args.length <= 0) {
    let ping = Math.floor(message.client.ping);
    message.channel.send(':ping_pong: Latencia: `' + ping + ' ms.`');
  }
  
  if (command === "crearclan" && args.length <= 0) {    
    message.channel.send({
      embed: {
        color: config.colors.default,
        description: "Para dar de alta un clan, tendrás que seguir estos pasos:\n\n**1-** Registrarlo en https://www.mariokartcentral.com/mkc/teams/ (necesitarás crearte una cuenta)\n\n**2-** Mandar un mensaje privado a <@239497463826874368> avisando de la creación de un nuevo clan"
      }
    });     
  }
  
  if (command === "busco" && args.length <= 0) {  
    var role = message.guild.roles.find(role => role.name === "busco-clan");
    var roles = message.member.roles
    // console.log("roles de usuario - " + roles)
    
    /*var value = '562629331415728139'

    roles = roles.filter(function(item) { 
        return item !== value
    })*/

    // console.log("filtrado - " + roles)
    
    if(message.member.roles.has(role.id)){
      message.member.removeRole(role);
        message.channel.send({
          embed: {
            color: config.colors.success,
            description: "Se te ha quitado el rol de **busco-clan**."
          }
        });
    } else {
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
          description: "Se han quitado los siguientes roles: " + roles.id
        }
      });      
    });  
    }       
  } 
  
  if (command === "quitar" && args.length <= 0) {  
    var mute = message.guild.roles.find(role => role.name === "mute");
    var miembros = message.guild.roles.find(role => role.name === "Miembros");
    var roles = message.member.roles
    if(message.member.roles.has(mute.id)){
        message.channel.send({
          embed: {
            color: config.colors.warning,
            description: "El estado de **mute** no te permite usar este comando."
          }
        });
    } else {
       message.member.removeRoles(roles); // salvo miembros
       message.channel.send({
          embed: {
            color: config.colors.success,
            description: "Se te han quitado todos tus roles anteriores"
          }
        });  
    }       
  } 
  
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
                description: "Pasas a tener estado de **mute**\nNo podrás escribir hasta que un moderador te lo quite"
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
  
  /* ----- COMANDO DE LIDER ----- */
  
  if (command === "lider" && args.length == 1) { 
    
    var role = message.guild.roles.find(role => role.name === "Lider");
    
    let mentioned = message.mentions.members.first();
    
    if(!mentioned.roles.has(role.id)){
    
      if(message.member.roles.find(r => r.name === "Staff") || message.member.roles.find(r => r.name === "Mods")){
          mentioned.addRoles(['562757330735726631', '562757372578234368']); // no funcional
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
          mentioned.removeRoles(['562757330735726631', '562757372578234368']);
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
  
  /* ----- COMANDO DE REP ----- */
  
  if (command === "rep" && args.length == 1) { 
    
    var role = message.guild.roles.find(role => role.name === "Representantes de clan");
    
    let mentioned = message.mentions.members.first();
    
    if(!mentioned.roles.has(role.id)){
    
      if(message.member.roles.find(r => r.name === "Staff") || message.member.roles.find(r => r.name === "Mods") || message.member.roles.find(r => r.name === "Lider")){
          mentioned.addRole(role).then(
          message.channel.send({
            embed: {
              color: config.colors.success,
              description: "Se ha añadido el rol de **Representantes de clan** a <@" + mentioned.id + ">."
            }
          })
          /*.then(msg => {
              message.channel.send({
                embed: {
                  color: config.colors.info,
                  description: "Ahora puedes usar el comando **!clan _@usuario_**"
                }
              });  
            })*/
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
      
    } else {
      
      if(message.member.roles.find(r => r.name === "Staff") || message.member.roles.find(r => r.name === "Mods") || message.member.roles.find(r => r.name === "Lider")){
          mentioned.removeRole(role).then(
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