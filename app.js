var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require('cors');

var authRouter = require('./routes/auth');
var taskRouter = require('./routes/task');
const connectDB = require('./dbConnections/db');

var app = express();
connectDB();

// Disable view engine setup (remove or comment out these lines)
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'ejs');

app.use(cors({
  origin: [process.env.FRONT_END_URL],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
}));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
/* GET home page. */
app.get('/', function(req, res) {
  res.send('Running API..');
});

app.use('/auth', authRouter);
app.use('/task', taskRouter);

app.use(function(req, res, next) {
  next(createError(404));
});

app.use(function(err, req, res, next) {
  res.status(err.status || 500).json({
    message: err.message,
    error: req.app.get('env') === 'development' ? err : {},
  });
});


module.exports = app;
