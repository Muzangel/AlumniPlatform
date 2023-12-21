const express = require('express'); //express framework
const app = express();
const path = require('path'); //path
const mustache = require('mustache-express'); //mustache
const webRouters = require('./routers/webRouters');

const session = require('express-session');

// Middleware to serve static files
app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css'));
app.use(express.urlencoded({ extended: false }));

app.use(express.static('public'))
app.use('img',express.static(path.join(__dirname,'public/img')))
// View engine setup
app.engine('mustache', mustache());
app.set('view engine', 'mustache');
app.set('views', path.join(__dirname, 'view'));

// Your route handlers from webRouters.js
app.use('/', webRouters);

//manages sessions
app.use(
  session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: false,
  })
);


//starting the server in port 3000
app.listen(3000, () => {
  console.log('Server started on port 3000. Ctrl^c to quit.');
});


