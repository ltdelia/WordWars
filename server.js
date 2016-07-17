// DEPENDENCIES USED

var express = require('express');
var hbs = require('express-handlebars');
var bodyParser = require('body-parser');
var path = require('path');

// Configuring Express

var app = express();
var PORT = process.env.PORT || 8080;

// Configuring Handlebars
// app.engine('hbs', expressHandlebars({
//   defaultLayout: 'main'
// }));
// app.set('view engine', 'hbs');

app.engine('hbs', hbs({extname:'hbs', defaultLayout: 'main', layoutsDir: __dirname + '/app/public/views/layouts'}));
app.set('views', path.join(__dirname, '/app/public/views'));
app.set('view engine', 'hbs');


// BodyParser makes it easy for our server to interpret data sent to it.
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.text());
app.use(bodyParser.json({type:'application/vnd.api+json'}));

// Static Content Folder
var staticContentFolder;
staticContentFolder = __dirname + '/app/public';

app.use('/static', express.static(staticContentFolder));

// Routing
require('./app/config/routes.js')(app);

// Listener
app.listen(PORT, function() {
	console.log("App listening on PORT: " + PORT);
});