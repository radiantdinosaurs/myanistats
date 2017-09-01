var express = require('express');
var app = express();
var exphbs = require('express-handlebars');
var handlebars = require('handlebars');
var hbs = exphbs.create({defaultLayout: 'main'});
var bodyParser = require('body-parser');
var path = require('path');
var client = require('node-rest-client').Client;
var client = new client();

app.engine('.hbs', hbs.engine);
app.set('view engine', '.hbs');
app.use(express.static(__dirname + '/bower_components'));
app.use(express.static(__dirname + '/css'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', require('./routes/index'));
app.use('/user-stats', require('./routes/user-stats'));

app.listen(8085, function() {
  console.log('Started on PORT 8085');
});
