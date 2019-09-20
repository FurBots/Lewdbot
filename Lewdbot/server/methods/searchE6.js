const request = require('request');
const blacklist = ['cub', 'young', 'gore', 'guro', 'death', 'snuff', 'loli', 'shota']

search = function(url, callback){

  var options = {
    url: url,
    headers: {
      'User-Agent': 'Lewdbot/0.1 (by NuclearBurger on E621)'
    }
  }

  request(options, function(error, response, json){
    callback(json)
  })
}
