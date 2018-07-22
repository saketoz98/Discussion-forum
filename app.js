const createError = require('http-errors');
      express = require('express');
      path = require('path');
      cookieParser = require('cookie-parser');
      logger = require('morgan');
      mongoose = require("mongoose");
      bodyParser = require("body-parser");
      methodOverride = require('method-override');
      cookieSession = require("cookie-session");
      keys = require("./config/keys");
      passport = require("passport");
      flash       = require("connect-flash");

const indexRouter = require('./routes/index');
const commentRouter = require("./routes/comments");
const authRouter  = require("./routes/auth");
const userRouter  = require("./routes/users");

const app = express();

const mongoURI = "mongodb://localhost:27017/SKForum";
mongoose.connect(mongoURI);
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.use(express.static("public"));
app.set('view engine', 'ejs');

//momentjs
app.locals.moment = require('moment');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(methodOverride("_method"));
app.use(cookieSession({
  maxAge : 24*60*60*1000,
  keys : [keys.session.cookieKey]
}));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
app.use(function(req, res, next){
   res.locals.currentUser = req.user;
   res.locals.error = req.flash("error");
   res.locals.success = req.flash("success");
   next();
});

app.use('/', indexRouter);
app.use('/discussions/:id/comments', commentRouter);
app.use('/',authRouter);
app.use('/',userRouter);


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
