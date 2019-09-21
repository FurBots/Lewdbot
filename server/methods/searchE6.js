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
    if (!error && response.statusCode == 200){
      callback(json)
    } else {
      console.log(response.statusCode + ', error = ' + error)
    }
  })
}
