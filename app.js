var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var io = require('socket.io')();

var index = require('./routes/index');
var users = require('./routes/users');

var app = express();
app.io = io;
app.locals.env = {
  DISPLAY_WIDTH: 96,
  DISPLAY_HEIGHT: 27,
  DISPLAY_SIZE: 2592
}

var re = new RegExp('^[0-1]{' + app.locals.env.DISPLAY_SIZE + '}$');
var message = '';

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);

app.post('/message', function(req, res, next) {
    match = req.body.message.match(re);
    if (match) {
      message = match[0];
      io.sockets.emit('message', message);
      res.send({});
    } else {
      var err = new Error('Invalid Message');
      err.status = 400;
      next(err);
    }
});

io.on('connection', function (socket) {
  socket.emit('init', message);
})

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
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
