const http = require('http');
const express = require('express');
const app = express();

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
    let channel = client.channels.get('513088446886313995');   
    channel.send({
        embed: {
          color: config.color,
          description: "¡Bienvenid@ al servidor comunitario de MK8D, " + member.user + "!\n\nPor favor, pásate por <#405031085500792833> y por <#471360321504804894> para estar al corriente de cómo funciona el servidor."
        }
     }).then(msg => {
      channel.send({
        embed: {
          color: config.color,
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
  
  if (command === "clan" && args.length <= 0) {    
    message.channel.send({
      embed: {
        color: config.color,
        description: "Para dar de alta un clan, tendrás que seguir estos pasos:\n\n**1-** Registrarlo en https://www.mariokartcentral.com/mkc/teams/ (necesitarás crearte una cuenta)\n\n**2-** Mandar un mensaje privado a <@239497463826874368> avisando de la creación de un nuevo clan"
      }
    });     
  }
  
  if (command === "busco" && args.length <= 0) {  
    var role = message.guild.roles.find(role => role.name === "busco-clan");
    if(message.member.roles.has(role.id)){
        message.member.removeRole(role);
        message.channel.send({
          embed: {
            color: config.color,
            description: "Se te ha quitado el rol de **busco-clan**."
          }
        });
    } else {
       message.member.addRole(role);
       message.channel.send({
          embed: {
            color: config.color,
            description: "Se te ha añadido el rol de **busco-clan**, ahora tienes acceso a <#405031498496868372>."
          }
        }); 
    }       
  }  
  
  if (command === "lakitu" && args.length <= 0) {       
    message.channel.send({
      embed: {
        color: config.color,
        "fields": [
          {
            "name": "Comandos generales",
            "value": "-"
          }/*,
          {       
            "name": "Mostrar información general del clan",
            "value": "**!info** _clan_"
          }*/,
          {
            "name": "Cómo dar de alta un clan",
            "value": "**!clan**"
          }/*,
          {
            "name": "Bienvenida [restringido a moderadores]",
            "value": "**!h1** _@usuario_",
            "inline": true
          }*/,{
            "name": "_\n\nComandos de usuario",
            "value": "-"
          }/*,
          {       
            "name": "Líderes de clan",
            "value": "**!rep** _@usuario_: Añadir o quitar reps del clan al que pertenece"
          },
          {
            "name": "Reps de clan",
            "value": "**!clan** _@usuario_: Añadir o quitar rol del clan al que pertenece"
          }*/,
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