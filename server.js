const http = require('http');
const express = require('express');
const app = express();

/* START HTTPS */
function checkHttps(req, res, next){
  // protocol check, if http, redirect to https  
  if(req.get('X-Forwarded-Proto').indexOf("https")!=-1){
    return next()
  } else {
    res.redirect('https://' + req.hostname + req.url);
  }
}

app.all('*', checkHttps);
/* END HTTPS */

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

// BOT
const Discord = require('discord.js');
const client = new Discord.Client();
const guild = new Discord.Guild();
const config = require("./config.json");

let prefix = process.env.PREFIX;

client.on('ready', () => {
  console.log('Lakitu iniciado');
  /*client.user.setPresence({
       status: "online",
       game: {
           name: "『 Disboard 』",
           type: "PLAYING" // WATCHING
       }
   });*/
  //client.user.setActivity('poner orden');

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
  
  if (command === "hi" && args.length == 1) {
    
    let usuario = message.mentions.members.first();
    
    if (message.member.roles.find("name", "Mods")) {
        
      if (usuario) {

        if(usuario.roles.find("name", "sin-clan")) {
           message.channel.send({
            embed: {
              color: config.color,
              description: "¡Bienvenid@ al servidor comunitario de MK8DX, " + usuario + "!\n\nPor favor, pásate por <#405031085500792833> y por <#471360321504804894> para estar al corriente de cómo funciona el servidor."
            }
          });
          message.channel.send({
            embed: {
              color: config.color,
              description: "Para buscar clan tienes habilitado el canal <#405031498496868372>, donde podrás ver clanes que buscan miembros y darte a conocer.\n\nAlternativamente, tienes https://www.mariokartcentral.com/mkc/teams dónde encontrarás también clanes de habla no hispana."
            }
          });
         } else {
           message.channel.send({
            embed: {
              color: config.color,
              description: "¡Bienvenid@ al servidor comunitario de MK8DX, " + usuario + "!\n\nPor favor, pásate por <#405031085500792833> y por <#471360321504804894> para estar al corriente de cómo funciona el servidor."
            }
          });        
         } 
      }
    }
    
  }
  
  if (command === "rol" && args.length >= 1) {    
        
    let usuario = message.mentions.members.first();
    console.log("valor de usuario:" + usuario)
    console.log("valor de args:" + args)
    
    args.shift();
    
    console.log("valor de args despues de shift:" + args)
    
    
    var roleTemp = args.join(' ');
    console.log("valor de roleTemp:" + roleTemp)
    
    let role = message.member.roles.find('name', roleTemp);
    
    console.log("valor de role:" + role);
    
    if(message.member.roles.has(role.name)) {
      /*if(){
         message.channel.send({
          embed: {
            color: config.color,
            description: "Rol `" + role + "` eliminado"
          } 
        }); 
         }*/
    } else {
      message.channel.send({
          embed: {
            color: config.color,
            description: "No dispones de ese rol"
          } 
        }); 
    }    
    
  }
  
  if (command === "lista" && args.length >= 1) {    
    var roleTemp = args.join(' ');
    
    console.log(roleTemp);
    
    let role = message.member.roles.find('name', roleTemp);   
    
    let imanity = message.guild.members.filter(member => {
      return member.roles.find("name", role);
    }).map(member => {
      return member.user.username;
    })
    /*let seirens = message.guild.members.filter(member => {
      return member.roles.find("name", "Seirens");
    }).map(member => {
      return member.user.username;
    })
    let werebeast = message.guild.members.filter(member => {
      return member.roles.find("name", "Werebeast");
    }).map(member => {
      return member.user.username;
    })*/
    message.channel.send({
      embed: {
        "color": config.color,
        "fields": [{
            "name": "**Listado de miembros**",
            "value": ":busts_in_silhouette: - " + (role.length),
          },
          {
            "name": "Miembros - " + role.length,
            "value": role.join("\n"),
            "inline": true
          }/*,
          {
            "name": "Representantes - " + seirens.length,
            "value": seirens.join("\n"),
            "inline": true
          },
          {
            "name": "Líder - " + werebeast.length,
            "value": werebeast.join("\n"),
            "inline": true
          }*/
        ]
      }
    })
  }
  
  if (command === "clan" && args.length <= 0) {    
    message.channel.send({
      embed: {
        color: config.color,
        description: "Para dar de alta un clan, tendrás que seguir estos pasos:\n\n**1-** Registrarlo en https://www.mariokartcentral.com/mkc/teams/ (necesitarás crearte una cuenta)\n\n**2-** Mandar un mensaje privado a <@239497463826874368> avisando de la creación de un nuevo clan"
      }
    });     
  }
  
  if (command === "lakitu" && args.length <= 0) {   
    if (message.member.roles.find("name", "Mods")) {
        
      if (usuario) {

        if(usuario.roles.find("name", "sin-clan")) {
           message.channel.send({
            embed: {
              color: config.color,
              description: "¡Bienvenid@ al servidor comunitario de MK8DX, " + usuario + "!\n\nPor favor, pásate por <#405031085500792833> y por <#471360321504804894> para estar al corriente de cómo funciona el servidor."
            }
          });
          message.channel.send({
            embed: {
              color: config.color,
              description: "Para buscar clan tienes habilitado el canal <#405031498496868372>, donde podrás ver clanes que buscan miembros y darte a conocer.\n\nAlternativamente, tienes https://www.mariokartcentral.com/mkc/teams dónde encontrarás también clanes de habla no hispana."
            }
          });
         } else {
           message.channel.send({
            embed: {
              color: config.color,
              description: "¡Bienvenid@ al servidor comunitario de MK8DX, " + usuario + "!\n\nPor favor, pásate por <#405031085500792833> y por <#471360321504804894> para estar al corriente de cómo funciona el servidor."
            }
          });        
         } 
      }
    }
    message.channel.send({
      embed: {
        color: config.color,
        "fields": [
          {
            "name": "Comandos generales",
            "value": "-"
          },
          {       
            "name": "Mostrar información general del clan",
            "value": "**!info** _clan_"
          },
          {
            "name": "Cómo dar de alta un clan",
            "value": "**!clan**"
          },
          {
            "name": "Bienvenida [restringido a moderadores]",
            "value": "**!h1** _@usuario_",
            "inline": true
          },{
            "name": "_\n\nComandos de usuario",
            "value": "-"
          },
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
            "value": "**!busco** _@usuario_: Añadir o quitar el rol de @busco-clan",
            "inline": true
          }
        ]
      }
    });     
  }
  
});

client.login(process.env.TOKEN);