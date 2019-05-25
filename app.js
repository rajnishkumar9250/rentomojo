var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var postRouter  = require('./routes/post');

var app = express();

// express session
const session = require('express-session');

// generates a random string for the
const randomString = require('randomstring');

// makes sending requests easy
const request = require('request');

// node core module, construct query string
const qs = require('querystring');

var config = require('./github.json');

console.log("client id: ", config.clientId);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// initializes session
app.use(
  session({
    secret: randomString.generate(),
    cookie: { maxAge: 60000 },
    resave: false,
    saveUninitialized: false
  })
);


app.all('/redirect', (req, res) => {
  // Here, the req is request object sent by GitHub
  console.log('Request sent by GitHub: ');
  console.log(req.query);

  // req.query should look like this:
  // {
  //   code: '3502d45d9fed81286eba',
  //   state: 'RCr5KXq8GwDyVILFA6Dk7j0LbFNTzJHs'
  // }
  const code = req.query.code;
  const returnedState = req.query.state;

  if (req.session.csrf_string === returnedState) {
    // Remember from step 5 that we initialized
    // If state matches up, send request to get access token
    // the request module is used here to send the post request
    //cconst redirect_uri = process.env.HOST + '/redirect';
    const redirect_uri = 'http://localhost:3000' + '/redirect';
    request.post(
      {
        url:
          'https://github.com/login/oauth/access_token?' +
          qs.stringify({
            client_id: config.clientId,
            client_secret: config.clientScret,
            code: code,
            redirect_uri: redirect_uri,
            state: req.session.csrf_string
          })
      },
      (error, response, body) => {
        // The response will contain your new access token
        // this is where you store the token somewhere safe
        // for this example we're just storing it in session
        console.log('Your Access Token: ');
        console.log(qs.parse(body));
        req.session.access_token = qs.parse(body).access_token;

        // Redirects user to /user page so we can use
        // the token to get some data.
        res.redirect('/users');
      }
    );
  } else {
    // if state doesn't match up, something is wrong
    // just redirect to homepage
    res.redirect('/');
  }
});


app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/post', postRouter);




// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});




module.exports = app;
