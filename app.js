process.env.PWD = process.cwd();
var express = require('express');
var app = express();
var exphbs = require('express-handlebars');
var Handlebars = require('handlebars');
var hbs = exphbs.create({defaultLayout: 'main'});
var bodyParser = require('body-parser');
var path = require('path');
var client = require('node-rest-client').Client;
var client = new client();

app.engine('.hbs', hbs.engine);
app.set('view engine', '.hbs');
app.set('port', (process.env.PORT || 8085));
app.use(express.static(process.env.PWD + '/bower_components'));
app.use(express.static(process.env.PWD + '/public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(process.env.PWD, 'public')));
app.use('/', require('./routes/index'));

app.get('/', function(req, res) {
    res.render('index', { title: 'MyAnimeStats' });
}).listen(app.get('port'), function() {
    console.log('App is running, server is listening on port', app.get('port'))
});

Handlebars.registerHelper('raw-helper', function(options) {
    return options.fn();
});