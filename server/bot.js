const Discord = require('discord.js');
const bot = new Discord.Client();
const request = require('request');
const { RichEmbed } = require('discord.js');

const blacklist = ['cub', 'young', 'gore', 'guro', 'death', 'snuff', 'loli', 'shota']

bot.on('ready', () => {
  console.log('Successfully started')
})

bot.on('message', async msg => {
  var prefix = '.'

  if (msg.author.bot) return;
  if (msg.content.substring(0, prefix.length) != prefix) return;

  var args = msg.content.slice(prefix.length).trim().split(/ +/g);
  var cmd = args.shift().toLowerCase();

  switch(cmd){

    case 'e621':

    if (msg.channel.nsfw == true){

      var url = urlBuild(args)
      search(url, function(data){
        var obj = JSON.parse(data)
        var attempt = 0
        var post = 0
        var flag = false

        for (let n = 0; n < obj.length; n++){
          flag = false
          for (let i = 0; i < blacklist.length; i++) {
            if(obj[n].tags.includes(blacklist[i])){
              flag = true
            }
          }
          if (flag == true){
            attempt += 1
          } else {
            post = attempt
            break
          }
        }

        if (attempt < obj.length){
          var postLink = 'https://e621.net/post/show/' + obj[post].id
          var embed = new RichEmbed()
          .setTitle('Link')
          .setURL(postLink)
          .setImage(obj[post].file_url)

          msg.channel.send(embed)
        } else {
          msg.channel.send('Unable to find image')
        }
      })
    } else {
      msg.channel.send('This command is for NSFW channels only')
    }

    break;
  }
})

bot.login(process.env.BOT_TOKEN);
