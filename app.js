var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var env = require('node-env-file');

var app = express();

// call socket.io to the app
app.io = require('socket.io')();

// if in development mode, load .env variables
if (app.get("env") === "development") {
    env(__dirname + '/.env');
}

// connect to database
app.db = mongoose.connect(process.env.MONGODB_URI);

// view engine setup - this app uses Hogan-Express
// https://github.com/vol4ok/hogan-express
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');
app.set('layout','layout');
app.engine('html', require('hogan-express'));;

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


// our routes will be contained in routes/index.js
var routes = require('./routes/index');
app.use('/', routes);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// // start listening with socket.io
app.io.on('connection', function(socket){

  console.log('a user is connected '+socket.id);

  socket.on('new task', function(task, sentiment){
    //console.log new task received from main
     console.log('socket new task ' + JSON.stringify(task) + "from: "+socket.id);
      // now emit data to all clients via the socket event 'task'
      app.io.emit('new task received', {task: task, sentiment: sentiment});     

  });

});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.json({
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.json({
    message: err.message,
    error: {}
  });
});


module.exports = app;
