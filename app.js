var express = require('express');
var exphbs = require('express-handlebars');
var app = express();

app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');
app.use(express.static(__dirname + '/bower_components'));
app.use(express.static(__dirname + '/css'));

app.get('/', (request, response) => {
  response.render('home');
});

app.get('/user', (request, response) => {
  response.render('user', {
    picture: 'https://68.media.tumblr.com/avatar_55cb4c37479b_128.png',
    name: 'Name'
  });
});

app.get('/about', (request, response) => {
  response.render('about');
});

app.listen(8085,function(){
  console.log("Started on PORT 8085");
});
