urlBuild = function(tags, amount, loc){
  var url = 'https://' + loc + '.net/post/index.json?limit=' + amount + '&tags=order:random+'
  for (x in tags){
    if (x < tags.length){
      url += tags[x] + '+';
    } else {
      url += tags[x];
    }
  }
  return url
}
