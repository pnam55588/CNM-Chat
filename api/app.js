var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const socketio = require('socket.io');
const http = require('http');
const cors = require('cors');

const authRouter = require('./routes/auth');
const usersRouter = require('./routes/users');

dotenv.config();
mongoose.connect(
  process.env.DB_CONNECT.toString(),
  { useUnifiedTopology: true, useNewUrlParser: true },
);

var app = express();
const server = http.createServer(app);
const io = socketio(server);
io.on('connection', (socket) => {
  console.log('New connection');
  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(cors());

app.use('/api/auth', authRouter);
app.use('/api/users', usersRouter); 

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
