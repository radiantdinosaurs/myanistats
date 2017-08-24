const express = require('express'),
    exphbs = require('express-handlebars'),
    handlebars = require('handlebars'),
    helpers = require('handlebars-form-helpers').register(handlebars);
    client = require('node-rest-client').Client,
    bodyParser = require('body-parser'),
    app = express(),
    client = new client(),
    mysql = require('mysql'),
    hbs = exphbs.create({defaultLayout: 'main'}),
    connection = mysql.createConnection ({
      host: 'localhost',
      port: 'port',
      user: 'root',
      password: 'password',
      database: 'database'
    }),
    //Custom modules
    op = require('./scripts/jikan-api-response-handler');
app.engine('.hbs', hbs.engine);
app.set('view engine', '.hbs');
app.use(express.static(__dirname + '/bower_components'));
app.use(express.static(__dirname + '/css'));
app.use(bodyParser.urlencoded({ extended: false }));
connection.connect();

app.get('/', (request, response) => {
  response.render('home');
});

app.post('/user', (request, response) => {
  let userName = request.body.search;
  var args = { path: { "id": userName }};
  var user = "";
  //Getting info from MAL API
  client.get('http://myanimelist.net/malappinfo.php?u=${id}&status=all&type=anime', args, function(data, res) {
    user = data;
    //Average score
    var scoreTotal = 0;
    var totalAnimeScored = 0;
    for(var i = 0; i < user.myanimelist.anime.length; i++) {
      if(user.myanimelist.anime[i].my_score != 0) {
        totalAnimeScored += 1;
      }
      scoreTotal += parseFloat(user.myanimelist.anime[i].my_score);
    }
    //End average score
    averageScore = scoreTotal/totalAnimeScored;

    //Getting info from Jikan
    client.get('http://jikan.me/api/anime/' + user.myanimelist.anime[5].series_animedb_id, args, function(data, res) {
      objectParser(data);
    })
    //End getting info from Jikan

    //Render results
    response.render('user', {
      picture: null,
      name: user.myanimelist.myinfo.user_name,
      days_spent_watching: user.myanimelist.myinfo.user_days_spent_watching,
      watching: user.myanimelist.myinfo.user_watching,
      completed: user.myanimelist.myinfo.user_completed,
      onhold: user.myanimelist.myinfo.user_onhold,
      dropped: user.myanimelist.myinfo.user_dropped,
      plan_to_watch: user.myanimelist.myinfo.user_plantowatch
    });
    //End render results
  }).on('error', function (err) {
    console.log('Something went wrong on the request', err.request.options);
  });
  client.on('error', function (err) {
    console.error('Something went wrong on the client', err);
  });
});
//End getting info from MAL API

app.listen(8085, function() {
  console.log('Started on PORT 8085');
});
