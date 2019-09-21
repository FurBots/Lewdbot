const Discord = require('discord.js');
const bot = new Discord.Client();
const request = require('request');
const { RichEmbed } = require('discord.js');

const blacklist = ['cub', 'young', 'gore', 'guro', 'death', 'snuff', 'loli', 'shota']
const e926blacklist = ['gore', 'guro', 'death', 'snuff']

bot.on('ready', () => {
  console.log('Successfully started')
})

bot.on('message', async msg => {
  var prefix = '.'

  if (msg.author.bot) return;
  if (msg.content.substring(0, prefix.length) != prefix) return;

  var args = msg.content.slice(prefix.length).trim().split(/ +/g);
  var cmd = args.shift().toLowerCase();

  msg.channel.send('Command: ' + cmd)
  switch(cmd){

    case 'e621':

    if (msg.channel.nsfw == true){

      var url = urlBuild(args, '5', 'e621')
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

    case 'e621-multi':

    if (msg.channel.nsfw == true){
      var amount = args.shift()
      if (int(amount) <= 10){

        var url = urlBuild(args, str(amount), 'e621')
        search(url, function(data){

          var obj = JSON.parse(data)
          var flag = false
          var attempt = 0


          for (let n = 0; n < obj.length; n++){
            flag = false
            for (let i = 0; i < blacklist.length; i++) {
              if(obj[n].tags.includes(blacklist[i])){
                flag = true
              }
            }
            if (flag == false){
              var postLink = 'https://e621.net/post/show/' + obj[n].id
              var embed = new RichEmbed()
              .setTitle('Link')
              .setURL(postLink)
              .setImage(obj[n].file_url)

              msg.channel.send(embed)
            } else {
              attempt += 1
            }
          }

          if (attempt >= obj.length){
            msg.channel.send('Unable to find images')
          }

        })
      } else {
        msg.channel.send('Can only send 10 posts at once')
      }
    } else {
      msg.channel.send('This command is for NSFW channels only')
    }
    break;

    case 'e926':

    var url = urlBuild(args, '5', 'e926')

    search(url, function(data){
      var obj = JSON.parse(data)
      var attempt = 0
      var post = 0
      var flag = false

      for (let n = 0; n < obj.length; n++){
        flag = false
        for (let i = 0; i < blacklist.length; i++) {
          if(obj[n].tags.includes(e926blacklist[i])){
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
        var postLink = 'https://e926.net/post/show/' + obj[post].id
        var embed = new RichEmbed()
        .setTitle('Link')
        .setURL(postLink)
        .setImage(obj[post].file_url)

        msg.channel.send(embed)
      } else {
        msg.channel.send('Unable to find image')
      }
    })

    break;
  }
})

bot.login(process.env.BOT_TOKEN);
