urlBuild = function(tags){
  var url = 'https://e621.net/post/index.json?limit=3&tags=order:random+'
  for (x in tags){
    url += tags[x];
  }
  return url
}
