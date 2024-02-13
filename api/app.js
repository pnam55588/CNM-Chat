var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const cors = require('cors');
const multer = require('multer');

const authRouter = require('./routes/auth');
const usersRouter = require('./routes/users');
const conversationRouter = require('./routes/conversation');

const { createServer } = require('http');
const socket = require('./config/socket');
const PORT = process.env.PORT || 3300
const app = express();
const server = createServer(app);

server.listen(PORT, () => {console.log(`listening on *:${PORT}`);});
socket(server);

dotenv.config();
mongoose.connect(
  process.env.DB_CONNECT.toString(),
  { useUnifiedTopology: true, useNewUrlParser: true },
);



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
app.use('/api/conversation', conversationRouter); 

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

  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        message: 'File size too large',
      });
    }
    if (err.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({
        message: 'Too many files',
      });
    }
    if (err.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({
        message: 'Unexpected field',
      });
    }
    if (err.code === 'LIMIT_PART_COUNT') {
      return res.status(400).json({
        message: 'Too many parts',
      });
    }
    if (err.code === 'LIMIT_FIELD_KEY') {
      return res.status(400).json({
        message: 'Field name too long',
      });
    }
    if (err.code === 'LIMIT_FIELD_VALUE') {
      return res.status(400).json({
        message: 'Field value too long',
      });
    }
  }
});



module.exports = app;
