const express = require('express');
const app = express();

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}
const port = process.env.PORT || 3000;

const passport = require('passport');
const session = require('express-session');
const methodOverride = require('method-override');

const router = require('./routes');

// template engine
const { engine } = require('express-handlebars');
app.engine('.hbs', engine({ extname: '.hbs' }));
app.set('view engine', '.hbs');
app.set('views', './views');

// data parsing setting
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

console.log(process.env.NODE_ENV);
// user authorization setting
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(express.static('public'));

app.get('/', (req, res) => res.render('index'));

// add routes
app.use('/', router);

app.listen(port, () => {
  console.log(`The app is running on http://localhost:${port}`);
});
