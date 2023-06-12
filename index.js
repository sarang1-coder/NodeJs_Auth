const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();
require('dotenv').config();
const port = process.env.PORT;
const expressLayouts = require('express-ejs-layouts');
const db = require('./config/mongoose');
const session = require('express-session');
const flash = require('connect-flash');
const customWare=require('./config/middleware');

app.use(express.urlencoded());
app.use(cookieParser());

// include static files
app.use(express.static('./assets'));

app.use(expressLayouts);

// extract style and scripts from sub pages into the layout
app.set('layout extractStyles', true);
app.set('layout extractScripts', true);

// set up the view engine
app.set('view engine', 'ejs');
app.set('views', './views');

// Express Session 
app.use(session({
  secret: 'mysecret',
  resave: false,
  saveUninitialized: false
}));




// connect flash 
app.use(flash());

app.use(customWare.setFlash);




// Routes
app.use('/', require('./routes'));

// check running 
app.listen(port, function(err) {
  if (err) {
    console.log('Error Server not running');
  }
  console.log('Server running', port);
});
