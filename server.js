// SCRIPT DE ARRANQUE
const http = require('http');
const express = require('express');
const app = express();

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
// http://disboard-tet.glitch.me

// BOT
const Discord = require('discord.js');
const client = new Discord.Client();
const guild = new Discord.Guild();
const config = require("./config.json");

let prefix = process.env.PREFIX;

client.on('ready', () => {
  console.log('Boo iniciado');
  /*client.user.setPresence({
       status: "online",
       game: {
           name: "『 Disboard 』",
           type: "PLAYING" // WATCHING
       }
   });*/
  client.user.setActivity('MK8DX');

});

client.on('message', async message => {

  if (message.author.bot) return;

  if (message.content.indexOf(prefix) !== 0) return;

  const args = message.content.slice(prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();

  if (command === "ping" && args.length <= 0) {
    let ping = Math.floor(message.client.ping);
    message.channel.send(':ping_pong: Latencia: `' + ping + ' ms.`');
  } else if (command === "hi" && args.length == 1) {
    
    let usuario = message.mentions.members.first();
    
    if (usuario) {
    
      if(usuario.roles.find("name", "Mods")) {
         message.channel.send({
          embed: {
            color: config.color,
            description: "¡Bienvenid@ al servidor de MK8DX " + usuario + "!\n\nPor favor, pásate por <#405031085500792833> y por <#471360321504804894> para estar al corriente de cómo funciona el servidor."
          }
        });
       }   
    }
    
  } else {
    /*message.channel.send({
      embed: {
        color: config.color,
        description: "**Tet no reconoce tu comando**."
      }
    });*/
  }

});


// Si +aschente werebeast o si +aschente immanity, ver k roles tiene, segun uno u otro, mostrar un mensaje u otro

client.login(process.env.TOKEN);