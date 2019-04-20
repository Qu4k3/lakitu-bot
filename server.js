const http = require('http');
const express = require('express');
const app = express();
require('dotenv').config();

function checkHttps(req, res, next) {
  if (req.get('X-Forwarded-Proto').indexOf("https") != -1) {
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

var prefix = config.prefix;

client.on('ready', () => {
  console.log('Lakitu iniciado');
  client.user.setPresence({
    status: "online"
  });
  client.user.setActivity('!lakitu en #cambios de rol', { type: 0 });
  /*0: playing, 1: streaming, 2: listening, 3: watching*/
  // a los corredores usar !lakitu
});

Date.prototype.addHours = function(h){
    this.setHours(this.getHours()+h);
    return this;
}

const talkedRecently = new Set();

function getTime() {
  var nextAvailability = new Date().addHours(2+2);
  var nextH = nextAvailability.getHours();
  var nextM = nextAvailability.getMinutes();
  var nextS = nextAvailability.getSeconds();
  nextH = nextH < 10 ? '0' + nextH : nextH;
  nextM = nextM < 10 ? '0' + nextM : nextM;
  nextS = nextS < 10 ? '0' + nextS : nextS;
  return nextH + ":" + nextM + ":" + nextS; 
}

const timeWaiting = 7200000;

/* ---------- AUTO BIENVENIDA ---------- */

client.on("guildMemberAdd", (member) => {
  let channel = client.channels.get('565211101457940491');
  channel.send("¡Bienvenid@ al servidor de la comunidad española de Mario Kart 8 Deluxe, <@" + member.id + ">!", {
    embed: {
      color: config.colors.default,
      description: "Por favor, pásate por <#405031085500792833> y por <#471360321504804894> para estar al corriente de cómo funciona el servidor."
    }
  }).then(msg => {
    channel.send({
      embed: {
        color: config.colors.default,
        description: "Para buscar clan, tienes habilitado el canal <#405031498496868372>, donde podrás ver clanes que buscan miembros y darte a conocer.\n\nAlternativamente, tienes https://www.mariokartcentral.com/mkc/teams donde encontrarás también clanes de habla no hispana."
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
        description: "Para dar de alta un clan, tendrás que seguir estos pasos:\n\n**1-** Registrarlo en https://www.mariokartcentral.com/mkc/teams/ (necesitarás crearte una cuenta)\n\n**2-** Mandar un mensaje privado a <@239497463826874368> avisando de la creación de un nuevo clan."
      }
    });
  }

  /* ---------- !BUSCO ---------- */

  if (command === "busco" && args.length <= 0) {
    const rep = message.guild.roles.find(role => role.name === "Representantes de clan");
    const lider = message.guild.roles.find(role => role.name === "Lider");
    const miembros = message.guild.roles.find(role => role.name === "Miembros");
    const busco = message.guild.roles.find(role => role.name === "busco-clan");
    const staff = message.guild.roles.find(role => role.name === "Staff");
    const mods = message.guild.roles.find(role => role.name === "Mods");
    const everyone = message.guild.roles.find(role => role.name === "@everyone");
    const delta = message.guild.roles.find(role => role.name === "Δ");
    var roles = message.member.roles

    roles = roles.filter(function (item) {
      return item !== miembros && item !== everyone && item !== busco && item !== staff && item !== mods && item !== delta && item !== rep
    })

    if (message.member.roles.has(busco.id)) {
      message.member.removeRole(busco);
      message.channel.send({
        embed: {
          color: config.colors.success,
          description: "Se te ha quitado el rol de **busco-clan**."
        }
      });
    } else {
      message.member.addRole(busco).then(
        message.member.removeRoles(roles))
      message.channel.send({
        embed: {
          color: config.colors.success,
          description: "Se te ha añadido el rol de **busco-clan**, ahora tienes acceso a <#405031498496868372>."
        }
      }).then(msg => {
        message.channel.send({
          embed: {
            color: config.colors.default,
            description: "Además, se te han quitado tus roles anteriores (si tenías)."
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

    roles = roles.filter(function (item) {
      return item !== miembros
    })

    if (message.member.roles.has(mute.id)) {
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
          description: "Se te han quitado tus roles anteriores."
        }
      });
    }
  }

  /* ---------- !MUTE ---------- */

  if (command === "mute" && args.length == 1) {
    if (message.member.roles.find(r => r.name === "Staff") || message.member.roles.find(r => r.name === "Mods")) {
      let mentioned = message.mentions.members.first();

      var mute = mentioned.guild.roles.find(role => role.name === "mute");
      var miembros = mentioned.guild.roles.find(role => role.name === "Miembros");

      if (mentioned.roles.has(mute.id)) {
        mentioned.addRole(miembros);
        mentioned.removeRole(mute);
        message.channel.send({
          embed: {
            color: config.colors.default,
            description: "Se te ha quitado el estado de **mute**, ya puedes escribir."
          }
        });
      } else {
        mentioned.addRole(mute);
        mentioned.removeRole(miembros);
        message.channel.send({
          embed: {
            color: config.colors.default,
            description: "<@" + mentioned.id + ">, pasas a tener estado de **mute**\nNo podrás escribir hasta que un moderador te lo quite."
          }
        });
      }
    } else {
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
    
    const rep = message.guild.roles.find(role => role.name === "Representantes de clan");
    const lider = message.guild.roles.find(role => role.name === "Lider");
    const miembros = message.guild.roles.find(role => role.name === "Miembros");
    const busco = message.guild.roles.find(role => role.name === "busco-clan");
    const staff = message.guild.roles.find(role => role.name === "Staff");
    const mods = message.guild.roles.find(role => role.name === "Mods");
    const everyone = message.guild.roles.find(role => role.name === "@everyone");
    const delta = message.guild.roles.find(role => role.name === "Δ");
    
    let mentioned = message.mentions.members.first();
    
    var repRoles = message.member.roles;
    var mentionedRoles = mentioned.roles;
    var evadeRoles = [rep, lider, miembros, busco, staff, mods, everyone, delta];

    const clanRep = repRoles.filter(function (item) {
      return evadeRoles.indexOf(item) === -1;
    })

    const clanMentioned = mentionedRoles.filter(function (item) {
      return evadeRoles.indexOf(item) === -1;
    })

    var clanRole = clanRep.find(role => role.id);
    var clanRoleMentioned = clanMentioned.find(role => role.id);


    if (!mentioned.roles.has(lider.id)) {

      if(message.member.roles.find(r => r.name === "Lider") && mentioned.roles.has(rep.id) && clanRole==clanRoleMentioned) {
        message.member.removeRole(lider.id);
        mentioned.addRole(lider.id)
        message.channel.send({
          embed: {
            color: config.colors.success,
            description: "Se ha traspasado el rol de **Lider** a <@" + mentioned.id + ">."
          }
        })
      } else if ((message.member.roles.find(r => r.name === "Staff") || message.member.roles.find(r => r.name === "Mods")) && mentioned.roles.has(rep.id)) {
        mentioned.addRole(lider.id)
        message.channel.send({
          embed: {
            color: config.colors.success,
            description: "Se ha añadido el rol de **Lider** y **Representantes de clan** a <@" + mentioned.id + ">."
          }
        });
      } else if (message.member.roles.find(r => r.name === "Staff") || message.member.roles.find(r => r.name === "Mods")) {
        mentioned.addRoles([lider.id, rep.id])
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
       if (message.member.roles.find(r => r.name === "Staff") || message.member.roles.find(r => r.name === "Mods")) {
        mentioned.removeRoles([lider.id, rep.id]);
        message.channel.send({
          embed: {
            color: config.colors.success,
            description: "Se ha eliminado el rol de **Lider** y **Representantes de clan** a <@" + mentioned.id + ">."
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

    const rep = message.guild.roles.find(role => role.name === "Representantes de clan");
    const lider = message.guild.roles.find(role => role.name === "Lider");
    const miembros = message.guild.roles.find(role => role.name === "Miembros");
    const busco = message.guild.roles.find(role => role.name === "busco-clan");
    const staff = message.guild.roles.find(role => role.name === "Staff");
    const mods = message.guild.roles.find(role => role.name === "Mods");
    const everyone = message.guild.roles.find(role => role.name === "@everyone");
    const delta = message.guild.roles.find(role => role.name === "Δ");

    var mentioned = message.mentions.members.first();

    var roles = mentioned.roles

    var repRoles = message.member.roles;
    var mentionedRoles = mentioned.roles;
    var evadeRoles = [rep, lider, miembros, busco, staff, mods, everyone, delta];

    const clanRep = repRoles.filter(function (item) {
      return evadeRoles.indexOf(item) === -1;
    })

    const clanMentioned = mentionedRoles.filter(function (item) {
      return evadeRoles.indexOf(item) === -1;
    })

    var clanRole = clanRep.find(role => role.id);
    var clanRoleMentioned = clanMentioned.find(role => role.id);
    
    var membersWithRole = message.guild.members.filter(member => {
      return member.roles.has(clanRoleMentioned.id) && member.roles.has(rep.id);
    }).map(member => {
      return member.user.username;
    }) 

    if (!mentioned.roles.has(rep.id)) {

      if (message.member.roles.find(r => r.name === "Staff") || message.member.roles.find(r => r.name === "Mods")) {
        if (membersWithRole.length < 3) {
          mentioned.addRole(rep).then(
            message.channel.send({
              embed: {
                color: config.colors.success,
                description: "Se ha añadido el rol de **Representantes de clan** a <@" + mentioned.id + ">."
              }
            }).then(msg => {
              var membersWithRole = message.guild.members.filter(member => {
                return member.roles.has(clanRoleMentioned.id) && member.roles.has(rep.id);
              }).map(member => {
                return member.user.username;
              }) 
              message.channel.send({
                embed: {
                  color: config.colors.default,
                  description: "Representantes actuales del clan: " + membersWithRole.length + "/3\n\n" + membersWithRole.join("\n")
                }
              });
            })
          )
        } else {
          message.channel.send({
            embed: {
              color: config.colors.warning,
              description: "El límite de representantes por clan es de **3**\n\nMiembros con rol de rep:\n" + membersWithRole.join("\n")
            }
          }).then(
            message.channel.send({
              embed: {
                color: config.colors.default,
                description: "Quita el rol de rep a otro miembro para poder añadir un nuevo rep."
              }
            })
          );
        }
      } else if (message.member.roles.find(r => r.name === "Lider")) {
        if(clanRole == clanRoleMentioned) {
          if (membersWithRole.length < 3) {
            mentioned.addRole(rep).then(
              message.channel.send({
                embed: {
                  color: config.colors.success,
                  description: "Se ha añadido el rol de **Representantes de clan** a <@" + mentioned.id + ">."
                }
              }).then(msg => {
                var membersWithRole = message.guild.members.filter(member => {
                  return member.roles.has(clanRoleMentioned.id) && member.roles.has(rep.id);
                }).map(member => {
                  return member.user.username;
                }) 
                message.channel.send({
                  embed: {
                    color: config.colors.default,
                    description: "Representantes actuales del clan: " + membersWithRole.length + "/3\n\n" + membersWithRole.join("\n")
                  }
                });
              })
            )
          }else {
          message.channel.send({
            embed: {
              color: config.colors.warning,
              description: "Los dos debeis estar en el mismo clan"
            }
          })
        }
        } else {
          message.channel.send({
            embed: {
              color: config.colors.warning,
              description: "El límite de representantes por clan es de **3**\n\nMiembros con rol de rep:\n" + membersWithRole.join("\n")
            }
          }).then(
            message.channel.send({
              embed: {
                color: config.colors.default,
                description: "Quita el rol de rep a otro miembro para poder añadir un nuevo rep."
              }
            })
          );
        }
      } else {
        message.channel.send({
          embed: {
            color: config.colors.warning,
            description: "No tienes los permisos necesarios para usar este comando."
          }
        })
      }

    } else {

      if (message.member.roles.find(r => r.name === "Staff") || message.member.roles.find(r => r.name === "Mods") || message.member.roles.find(r => r.name === "Lider")) {
        mentioned.removeRole(rep).then(
          message.channel.send({
            embed: {
              color: config.colors.success,
              description: "Se ha eliminado el rol de **Representantes de clan** a <@" + mentioned.id + ">."
            }
          }).then(msg => {
            var membersWithRole = message.guild.members.filter(mentioned => {
              return mentioned.roles.has(clanRole.id) && mentioned.roles.has(rep.id);
            }).map(mentioned => {
              return mentioned.user.username;
            }) 
            message.channel.send({
              embed: {
                color: config.colors.default,
                description: "Representantes actuales del clan: " + membersWithRole.length + "/3\n\n" + membersWithRole.join("\n")
              }
            });
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

  /* ---------- !CLAN ---------- */

  if (command === "clan" && args.length == 1) {
    
    if (talkedRecently.has(message.author.id)) {
      var arrWaiting = [ ...talkedRecently ]; 
      // console.info( arrWaiting );
       var index = arrWaiting.findIndex(arrWaiting => arrWaiting === message.author.id);
      
       message.channel.send({embed: {color: config.colors.warning, description: "Espera 2 horas antes de volver a usar este comando. Podrás volver a usarlo a las: " + arrWaiting[index+1]}})
    } else {


    var rep = message.guild.roles.find(role => role.name === "Representantes de clan");
    var lider = message.guild.roles.find(role => role.name === "Lider");
    var miembros = message.guild.roles.find(role => role.name === "Miembros");
    var busco = message.guild.roles.find(role => role.name === "busco-clan");
    var staff = message.guild.roles.find(role => role.name === "Staff");
    var mods = message.guild.roles.find(role => role.name === "Mods");
    var everyone = message.guild.roles.find(role => role.name === "@everyone");
    var delta = message.guild.roles.find(role => role.name === "Δ");

    var mentioned = message.mentions.members.first();

    var repRoles = message.member.roles;
    var mentionedRoles = mentioned.roles;
    var evadeRoles = [rep, lider, miembros, busco, staff, mods, everyone, delta];

    const clanRep = repRoles.filter(function (item) {
      return evadeRoles.indexOf(item) === -1;
    })

    const clanMentioned = mentionedRoles.filter(function (item) {
      return evadeRoles.indexOf(item) === -1;
    })

    var clanRole = clanRep.find(role => role.id);
    var clanRoleMentioned = clanMentioned.find(role => role.id);

    if (clanRole == clanRoleMentioned) {

      if (message.member.roles.find(r => r.name === "Staff") || message.member.roles.find(r => r.name === "Mods") || message.member.roles.find(r => r.name === "Representantes de clan")) {
        mentioned.removeRoles([clanRoleMentioned, rep, lider]).then(
          message.channel.send({
            embed: {
              color: config.colors.success,
              description: "Se ha eliminado el rol de " + clanRole + " a <@" + mentioned.id + ">."
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

      if (message.member.roles.find(r => r.name === "Staff") || message.member.roles.find(r => r.name === "Mods") || message.member.roles.find(r => r.name === "Representantes de clan")) {

        if (clanRoleMentioned !== null) {
          mentioned.removeRoles([clanRoleMentioned, rep, lider]).then(
          mentioned.addRole(clanRole))
            message.channel.send({
              embed: {
                color: config.colors.success,
                description: "Se ha añadido el rol de " + clanRole + " a <@" + mentioned.id + ">."
              }
            }
          ).then(
            message.channel.send({
              embed: {
                color: config.colors.default,
                description: "Se ha eliminado el rol de " + clanRoleMentioned
              }
            })
          )
        } else {
          mentioned.removeRole(busco).then(
          mentioned.addRole(clanRole)).then(
            message.channel.send({
              embed: {
                color: config.colors.success,
                description: "Se ha añadido el rol de " + clanRole + " a <@" + mentioned.id + ">."
              }
            })
          )

        }
      } else {
        message.channel.send({
          embed: {
            color: config.colors.warning,
            description: "No tienes los permisos necesarios para usar este comando."
          }
        })
      }

    }
      
      // Adds the user to the set so that they can't talk for a X time
      talkedRecently.add(message.author.id).add(getTime());
        setTimeout(() => {
          // Removes the user from the set after a X time
          talkedRecently.delete(message.author.id);
        }, timeWaiting);
    }
      

  }
  
  /* ---------- !CLAN MULTIPLE ---------- */

  if (command === "clan" && args.length > 1 && args.length <= 5) {
    
        
    if (talkedRecently.has(message.author.id)) {
      var arrWaiting = [ ...talkedRecently ]; 
      // console.info( arrWaiting );
       var index = arrWaiting.findIndex(arrWaiting => arrWaiting === message.author.id);
      
       message.channel.send({embed: {color: config.colors.warning, description: "Espera 2 horas antes de volver a usar este comando. Podrás volver a usarlo a las: " + arrWaiting[index+1]}})
    } else {

    const rep = message.guild.roles.find(role => role.name === "Representantes de clan");
    const lider = message.guild.roles.find(role => role.name === "Lider");
    const miembros = message.guild.roles.find(role => role.name === "Miembros");
    const busco = message.guild.roles.find(role => role.name === "busco-clan");
    const staff = message.guild.roles.find(role => role.name === "Staff");
    const mods = message.guild.roles.find(role => role.name === "Mods");
    const everyone = message.guild.roles.find(role => role.name === "@everyone");
    const delta = message.guild.roles.find(role => role.name === "Δ");

    const mentionedAll = message.mentions.members;

    const repRoles = message.member.roles;
    const evadeRoles = [rep, lider, miembros, busco, staff, mods, everyone, delta];
    
    const clanRep = repRoles.filter(function (item) {
      return evadeRoles.indexOf(item) === -1;
    })
    
    mentionedAll.forEach(function(mentioned) {
      
      var mentionedRoles = mentioned.roles;
      
      var clanMentioned = mentionedRoles.filter(function (item) {
      return evadeRoles.indexOf(item) === -1;
    })

    var clanRole = clanRep.find(role => role.id);
    var clanRoleMentioned = clanMentioned.find(role => role.id);

    if (clanRole == clanRoleMentioned) {

      if (message.member.roles.find(r => r.name === "Staff") || message.member.roles.find(r => r.name === "Mods") || message.member.roles.find(r => r.name === "Representantes de clan")) {
        mentioned.removeRoles([clanRoleMentioned, rep, lider]).then(
          message.channel.send({
            embed: {
              color: config.colors.success,
              description: "Se ha eliminado el rol de " + clanRole + " a <@" + mentioned.id + ">."
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

      if (message.member.roles.find(r => r.name === "Staff") || message.member.roles.find(r => r.name === "Mods") || message.member.roles.find(r => r.name === "Representantes de clan")) {

        if (clanRoleMentioned !== null) {
          mentioned.removeRoles([clanRoleMentioned, rep, lider]).then(
          mentioned.addRole(clanRole))
            message.channel.send({
              embed: {
                color: config.colors.success,
                description: "Se ha añadido el rol de " + clanRole + " a <@" + mentioned.id + "> y eliminado el de " + clanRoleMentioned
              }
            }
          )
        } else {
          mentioned.removeRole(busco).then(
          mentioned.addRole(clanRole)).then(
            message.channel.send({
              embed: {
                color: config.colors.success,
                description: "Se ha añadido el rol de " + clanRole + " a <@" + mentioned.id + ">."
              }
            })
          )

        }
      } else {
        message.channel.send({
          embed: {
            color: config.colors.warning,
            description: "No tienes los permisos necesarios para usar este comando."
          }
        })
      }

    }
    });  
    
      // Adds the user to the set so that they can't talk for a X time
      talkedRecently.add(message.author.id);
        setTimeout(() => {
          // Removes the user from the set after a X time
          talkedRecently.delete(message.author.id);
        }, timeWaiting);
    }

  }
  
  if (command === "clan" && args.length > 6) {
    message.channel.send({
        embed: {
          color: config.colors.warning,
          description: "El límite de cambio de clan es de 5 personas a la vez."
        }
      }
    )
  }

  /* ---------- !LAKITU ---------- */

  if (command === "lakitu" && args.length <= 0) {
    message.channel.send({
      embed: {
        color: config.colors.default,
        "fields": [{
            "name": "Líderes de clan",
            "value": "**!lider** _@usuario_: Traspasar el rol de lider a un representante.\n**!rep** _@usuario_: Añadir o quitar reps del clan al que pertenece."
          },
          {
            "name": "-\nReps de clan",
            "value": "**!clan** _@usuario_: Añadir o quitar rol del clan al que pertenece.\n**!clan** _@usuario_ _@usuario_ _@usuario_ ...: Añadir o quitar rol del clan a varios usuarios a la vez (hasta 5)."
          },
          {
            "name": "-\nTodos los usuarios",
            "value": "**!busco**: Añadir o quitar el rol de **busco-clan**, añadirlo implica quitarse el rol de clan.\n**!quitar**: Quita todos los roles actuales (excepto miembros)."
          }
        ]
      }
    });
  }

});

client.login(process.env.TOKEN);