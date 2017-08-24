objectParser = function(data) {
  var anime = {};
  var producer = {};
  var licensor = {};
  var studio = {};
  var genre = {};

  anime['link-canonical'] = data['link-canonical'];
  anime['synopsis'] = data.synopsis;
  anime['title'] = data.title;
  anime['image'] = data.image;
  anime['synonyms'] = data.synonyms;
  anime['japanese'] = data.japanese;
  anime['type'] = data.type;
  anime['episodes'] = data.episodes;
  anime['status'] = data.status;
  anime['aired'] = data.aired;
  anime['premiered'] = data.premiered;
  anime['broadcast'] = data.broadcast;
  anime['source'] = data.source;
  anime['duration'] = data.duration;
  anime['rating'] = data.rating;
  anime['score'] = data.score[0];
  anime['number-of-votes'] = data.score[1];
  anime['ranked'] = data.ranked;
  anime['popularity'] = data.popularity;
  anime['members'] = data.members;
  anime['favorites'] = data.favorites;
  anime['background'] = data.background;
  anime['opening-theme'] = data['opening-theme'];
  anime['ending-theme'] = data['ending-theme'];

  dataToObject(data.producer, producer);
  dataToObject(data.licensor, licensor);
  dataToObject(data.studio, studio);
  dataToObject(data.genre, genre);
}

function dataToObject(data, obj) {
  arrJikanId = [];
  arrNames = [];
  if(data[0][2] == null) {
    for(var i in data) {
      element = data[i] + '';
      var elementArr = element.split(',');
      var jikanId = elementArr[0];
      var elementName = elementArr[1];
      arrJikanId.push(jikanId);
      arrNames.push(elementName.replace(/[^a-zA-Z0-9]/g,''));
    }
  }
  else {
    element = data + '';
    var elementArr = element.split(',');
    var jikanId = elementArr[0];
    var elementName = elementArr[1];
    arrJikanId.push(jikanId);
    arrNames.push(elementName.replace(/[^a-zA-Z0-9]/g,''));
  }
  obj['jikan-id'] = arrJikanId;
  obj['name'] = arrNames;
}
