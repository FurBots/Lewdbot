const Discord = require('discord.js');
const bot = new Discord.Client();
const request = require('request');
const { RichEmbed } = require('discord.js');

const blacklist = ['cub', 'young', 'gore', 'guro', 'death', 'snuff', 'loli', 'shota', 'trials_in_tainted_space', 'scat', 'vomit', 'blood', 'shocking_(artist)', 'fart', 'rape', 'forced', 'hyper', 'vore']
const e926blacklist = ['gore', 'guro', 'death', 'snuff']
const deleteReactID = '626423940088070164'

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

          delByReact(embed)

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
      var tags = args

      if (amount <= 5){
        var url = urlBuild(tags, amount, 'e621')
        search(url, function(data){
          var obj = JSON.parse(data)
          var attempt = 0
          var flag = false
          var embed = ''

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
              var postLink = 'https://e621.net/post/show/' + obj[n].id
              embed = new RichEmbed()
              .setTitle('Link')
              .setURL(postLink)
              .setImage(obj[n].file_url)

              delByReact(embed)
            }
          }
        })
      } else {
        msg.channel.send('No more than 5 posts at once (for the sake of rate limits)')
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
        for (let i = 0; i < e926blacklist.length; i++) {
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

        delByReact(embed)
      } else {
        msg.channel.send('Unable to find image')
      }
    })

    break;
  }

  async function delByReact(emb){
    var m = await msg.channel.send(emb).then(function(m){
      m.react('❌')
      var filt = (react, u) => react.emoji.name === '❌' && u.id === msg.author.id;
      const collect = m.createReactionCollector(filt, {time: 90000});
      collect.on('collect', react => {
        m.delete()
        collect.stop()
      });
      collect.on('end', collected =>{
        if (m.deleted == false){
          m.clearReactions()
        }
      });
    })
  }

})

bot.login(process.env.BOT_TOKEN);
