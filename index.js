const Discord = require("discord.js");
const token = process.env.TOKEN;
const prefix = 's!';
const client = new Discord.Client();
const config = require('./config.json');
const ytdl = require('ytdl-core');
const fs = require('fs');
var cli = new Discord.Client({autoReconnect:true})
var Jimp = require("jimp");

fs.readdir("./events/", (err, files) => {
  if (err) return console.error(err);
  files.forEach(file => {
    let eventFunction = require(`./events/${file}`);
    let eventName = file.split(".")[0];
client.on(eventName, (...args) => eventFunction.run(client, ...args));
  });
});
client.on("message", message => {
  if (message.author.bot) return;
  if (!message.content.startsWith(config.prefix)) return;


})

function play(connection, message) {
    var server = servers[message.guild.id];

    server.dispatcher = connection.playStream(ytdl(server.queue[0], {filter: 'audioonly'}));

    server.queue.shift();

    server.dispatcher.on('end', function() {
        if (server.queue[0]) play(connection, message);
        else connection.disconnect();
  });
}

var fortunes = [
    "Yes",
    "No",
    "Maybe",
    "Never",
    "Why?",
    "I think so?",
    "Hell yeah!",
    '69% for sure',
    'Are you kidding?!',
    'Ask again',
    'Better not tell you now',
    'Definitely... not',
    'Dont bet on it',
    'Doubtful',
    'For sure',
    'Forget about it',
    'Hah!',
    'Hells no',
    'In due time',
    'Indubitably!',
    'It is certain',
    'It is so',
    'Leaning towards no',
    'Look deep in your heart and you will see the answer KappaPride',
    'Most definitely',
    'Most likely',
    'My sources say yes',
    "That's a tough one",
    "That's like totally a yes. Duh!",
    'The answer might not be not no',
    'The answer to that isnt pretty',
    'The heavens point to yes',
    'Yesterday it would have been a yes, but today its a yep',
    'You will have to wait',
    ':thinking:'

];

var bot =  new Discord.Client();

var servers = {};
bot.on('ready', () => {
  console.log(`Working, ${bot.guilds.size} Servers, ${bot.users.size} Users, ${bot.channels.size} Channels. `)
  bot.user.setGame('Use s!help')

});
let command = message.content.split(" ")[0];
command = command.slice(config.prefix.length);

let args = message.content.split(" ").slice(1);

bot.on('message', async message => {
    if (message.author.equals(bot.user)) return;

    if (!message.content.startsWith(prefix)) return;

    var args = message.content.substring(prefix.length).split(' ');



    switch (args[0].toLowerCase()) {
     case "play":
                  if (!args[1]) {
                    message.reply(':x: Where is the link?');
                    return;
    
                  }
    
                  if (!message.member.voiceChannel) {
                    message.reply(":x: You need enter in a voice channel!")
                    return;
    
                  }
    
                  if (!servers[message.guild.id]) servers[message.guild.id] = {
                    queue: []
    
                  };
              
                   var server = servers[message.guild.id];
    
                   server.queue.push(args[1]);
    
                if (!message.guild.voiceConnection) message.member.voiceChannel.join().then(function(connection) {
                  play(connection, message);
                  });
                  break;
            case 'skip':
                 var server = servers[message.guild.id];
    
                 if (server.dispatcher) server.dispatcher.end();
                  break;
           case 'stop':
                 var server = servers[message.guild.id];
    
                 if (message.guild.voiceConnection) message.guild.voiceConnection.disconnect();
                  break;

     case "say":
     let argumentos = message.content.split(" ").slice(1);
     let say = argumentos.join(" ")
     message.channel.sendMessage(say)
     message.delete()
     break;
                case "ping":
                      var embed = new Discord.RichEmbed()
                      .addField('There is:', `${bot.ping}`)
                          .setColor(0xcc0000)
                      message.channel.sendEmbed(embed);
                      break;
                      case"server":
                      var embed = new Discord.RichEmbed()
                      .addField('Go to my beautiful server and talk!', 'https://discord.gg/XTftS85')
                      .setColor(0xcc0000)         
                      message.channel.sendEmbed(embed);
                      break;
                   case "help":
                         var embed = new Discord.RichEmbed()
                             .addField('Commands:', 's!emojilist ,s!owners,s!invite ,s!helpadm ,s!server ,s!fortune, s!serverinfo, s!say, s!ping, s!help and s!avatar')
                             .addField('Music commands', 's!play, s!skip and s!stop')
                             .setThumbnail(bot.user.avatarURL)
                             .setColor(0xcc0000)
                             .setFooter( 'Slice by: Nekro.')
                        message.channel.sendEmbed(embed);
                       break;
                       case "helpadm":
                       var embed = new Discord.RichEmbed()
                       .addField('Admin commands: s!ban.', 'Its only for now, I will add more later')
                       .setColor(0xcc0000)
                       message.channel.sendEmbed(embed);
                       break;
                       case "serverinfo":
                       var embed = new Discord.RichEmbed()
                           .setThumbnail(message.guild.iconURL)
                           .addField(`  Information from ${message.guild.name}`, `:slight_smile: Members on this server: ${message.guild.memberCount}`)
                           .addField(`:loud_sound: VoiceChannels and TextChannels: ${message.guild.channels.size}`, `:bookmark: Roles here: ${message.guild.roles.size}`)
                           .addField(`Server region: ${message.guild.region}`, `:tools: Owner of this server: ${message.guild.owner} ID: ${message.guild.ownerID}`)
                           .addField(`:id: Server ID: ${message.guild.id}`, 'ㅤ')
                           message.channel.sendEmbed(embed);
                           break;
case"owners":
var embed = new Discord.RichEmbed()
.addField('This beautiful bot has made by:', '<@357666124894306305> And <@267833432913084418>')
.addField('This is helpers of the bot:', '<@181482690191687680> And <@315307066376060959>')
.setThumbnail(bot.user.avatarURL)
.setColor(0xcc0000)
message.channel.sendEmbed(embed);
break;

                     
                     case"fortune":
if (args[1]) message.channel.sendMessage(fortunes[Math.floor(Math.random() * fortunes.length)]);
else message.channel.sendMessage("Can't see your fortune =/");
                     break;
                     case "ban":
    if(!message.member.roles.some(r=>["Administrator", "Mod", "Moderator", "Mods"].includes(r.name)) )
    return message.reply("Sorry, you don't have permissions to use this, If you have, Create a role named Mod, Moderator or Administrator!");
  
  let member = message.mentions.members.first();
  if(!member)
    return message.reply("Please mention a valid member of this server");
  if(!member.bannable) 
    return message.reply("I cannot ban this user! Do they have a higher role? Do I have ban permissions?");

  let reason = args.slice(1).join(' ');
  if(!reason)
    return message.reply("Please indicate a reason for the ban!");
  
  await member.ban(reason)
    .catch(error => message.reply(`Sorry ${message.author} I couldn't ban because of : ${error}`));
  message.reply(`<@${member.user.id}> has been banned by ${message.author.tag} because: ${reason}`);
break;
case"invite":
var embed = new Discord.RichEmbed()
.addField('Here, Invite me to a server!', `[Click Here!](https://discordapp.com/oauth2/authorize?client_id=350456958890934272&scope=bot&permissions=0)`)
.setColor(0xcc0000)
message.channel.sendEmbed(embed);
break;
            case "avatar":
                       var embed = new Discord.RichEmbed()
                     
                       let user = message.mentions.users.first();
                       if (message.mentions.users.size < 1) return message.reply(':x: Tag a person 2 send the avatar!').catch(console.error);

                        message.channel.send({embed: {
                        color: 0xcc0000,
                        author: {
                        name:  `Avatar`,
                        icon_url: user.avatarURL
                        },

                        description: `**:frame_photo: Avatar by: ${user.username}**`   
                        }});
                        message.channel.send(user.avatarURL)            
                break;
                case"emojilist":
                const emojiList = message.guild.emojis.map(e=>e.toString()).join(" ");
                message.channel.send(emojiList);
                break;
                case"shutdown":
                if(message.author.id !== config.ownerID) return;
                process.exit()
                break;
              
                case"eval":

                const args = message.content.split(" ").slice(1);
                
                    if(message.author.id !== config.ownerID) return;
                    try {
                      const code = args.join(" ");
                      let evaled = eval(code);
                
                      if (typeof evaled !== "string")
                        evaled = require("util").inspect(evaled);
                
                      message.channel.send(clean(evaled), {code:"xl"});
                    } catch (err) {
                      message.channel.send(`\`ERROR\` \`\`\`xl\n${clean(err)}\n\`\`\``);
                    
                  
                };
                break;
      default:
           message.react(`❌`)
}
});
bot.login(process.env.TOKEN)


