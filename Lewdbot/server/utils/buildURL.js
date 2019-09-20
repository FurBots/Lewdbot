urlBuild = function(tags){
  var url = 'https://e621.net/post/index.json?limit=5&tags=order:random+'
  for (x in tags){
    if (x < tags.length){
      url += tags[x] + '+';
    } else {
          url += tags[x];
    }
  }
  return url
}
